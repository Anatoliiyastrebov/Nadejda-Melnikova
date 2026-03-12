import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3100);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8585413661:AAFZ4Y8F0JLLDfQLFNsbSlsUiB4P3qf22Dc';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003086304655';
const DEBUG_UPLOAD = String(process.env.DEBUG_UPLOAD || 'false').toLowerCase() === 'true';
const UPLOAD_DIR = '/tmp/uploads';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const TELEGRAM_TIMEOUT_MS = 10000;
const TELEGRAM_RETRIES = 3;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const BLOCKED_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.com',
  '.scr',
  '.pif',
  '.vbs',
  '.ps1',
  '.jar',
  '.msi',
  '.dll',
  '.sh'
]);

function logDebug(...args) {
  if (DEBUG_UPLOAD) {
    console.log('[DEBUG_UPLOAD]', ...args);
  }
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: UPLOAD_DIR,
    limits: {
      fileSize: MAX_FILE_SIZE
    },
    abortOnLimit: true,
    createParentPath: true
  })
);

function getFilesFromRequest(req) {
  if (!req.files) return [];
  const allValues = Object.values(req.files);
  const flattened = allValues.flatMap((entry) => (Array.isArray(entry) ? entry : [entry]));
  return flattened;
}

function isFileAllowed(fileName) {
  const ext = path.extname(fileName || '').toLowerCase();
  return !BLOCKED_EXTENSIONS.has(ext);
}

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const safeText = String(text || '').trim();
  if (!safeText) return null;

  // Telegram message limit: 4096 chars
  const chunkSize = 3500;
  const chunks = safeText.length > chunkSize
    ? safeText.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || []
    : [safeText];

  let lastResponse = null;
  for (const chunk of chunks) {
    const response = await axios.post(
      url,
      {
        chat_id: CHAT_ID,
        text: chunk
      },
      {
        timeout: TELEGRAM_TIMEOUT_MS
      }
    );
    lastResponse = response.data;
  }
  return lastResponse;
}

async function sendDocumentWithRetry(filePath, caption, fileName) {
  for (let attempt = 1; attempt <= TELEGRAM_RETRIES; attempt += 1) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File missing before Telegram send: ${filePath}`);
      }

      const form = new FormData();
      form.append('chat_id', CHAT_ID);
      form.append('document', fs.createReadStream(filePath), fileName);
      if (caption) {
        form.append('caption', caption.slice(0, 1024));
      }

      logDebug('telegram request', { attempt, fileName, filePath });

      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        form,
        {
          headers: form.getHeaders(),
          timeout: TELEGRAM_TIMEOUT_MS,
          maxBodyLength: Infinity,
          maxContentLength: Infinity
        }
      );

      console.log('Telegram success:', response.data);
      return { ok: true, data: response.data };
    } catch (err) {
      console.error('Telegram send error:', err?.response?.data || err);
      if (attempt === TELEGRAM_RETRIES) {
        return { ok: false, error: err?.response?.data || String(err) };
      }
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
    }
  }

  return { ok: false, error: 'Unknown retry state' };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/submit', async (req, res) => {
  const tempFilesToCleanup = [];

  try {
    console.log('form received', {
      questionnaireId: req.body?.questionnaireId,
      hasFiles: !!req.files
    });
    logDebug('request body keys', Object.keys(req.body || {}));

    const incomingFiles = getFilesFromRequest(req);

    const savedFiles = [];
    for (const file of incomingFiles) {
      if (!file || !file.name) {
        return res.status(400).json({ error: 'Invalid file payload' });
      }

      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: 'File too large' });
      }

      if (!isFileAllowed(file.name)) {
        return res.status(400).json({ error: `Blocked file type: ${file.name}` });
      }

      console.log('File received:', {
        name: file.name,
        size: file.size,
        mimetype: file.mimetype
      });

      const safeName = `${Date.now()}_${Math.random().toString(16).slice(2)}_${file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '_'
      )}`;
      const savePath = path.join(UPLOAD_DIR, safeName);
      await file.mv(savePath);

      if (!fs.existsSync(savePath)) {
        return res.status(500).json({ error: 'Saved file not found on disk' });
      }

      tempFilesToCleanup.push(savePath);
      savedFiles.push({
        originalName: file.name,
        savePath,
        size: file.size
      });

      console.log('file saved', { originalName: file.name, savePath, size: file.size });
    }

    const textMessage = req.body?.message || 'Новая анкета получена';
    try {
      const textResponse = await sendTelegramMessage(textMessage);
      logDebug('telegram text response', textResponse);
    } catch (textError) {
      console.error('Text message send failed, continuing with file pipeline:', textError?.response?.data || textError);
    }

    const sendResults = [];
    for (const file of savedFiles) {
      const caption = `📎 Файл анкеты: ${file.originalName}`;
      const result = await sendDocumentWithRetry(file.savePath, caption, file.originalName);
      sendResults.push({ file: file.originalName, ...result });

      if (!result.ok) {
        await sendTelegramMessage(
          `File upload failed but user submitted: ${file.originalName}\nQuestionnaire: ${
            req.body?.questionnaireId || 'unknown'
          }`
        );
      }
    }

    const failed = sendResults.filter((r) => !r.ok);
    console.log('telegram response', { total: sendResults.length, failed: failed.length });

    if (failed.length > 0 && sendResults.length > 0) {
      return res.status(207).json({
        ok: false,
        partial: true,
        message: 'Some files failed to send to Telegram',
        failed
      });
    }

    return res.json({ ok: true, sent: sendResults.length, filesReceived: incomingFiles.length });
  } catch (error) {
    console.error('upload pipeline error', error?.response?.data || error);
    return res.status(500).json({
      error: 'Internal upload pipeline error',
      details: DEBUG_UPLOAD ? String(error?.message || error) : undefined
    });
  } finally {
    for (const filePath of tempFilesToCleanup) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file', filePath, cleanupError);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Upload API running on port ${PORT}`);
  logDebug('debug mode enabled');
});
