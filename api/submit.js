import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8585413661:AAFZ4Y8F0JLLDfQLFNsbSlsUiB4P3qf22Dc';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003086304655';
const DEBUG_UPLOAD = String(process.env.DEBUG_UPLOAD || 'false').toLowerCase() === 'true';
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const TELEGRAM_TIMEOUT_MS = 10000;
const TELEGRAM_RETRIES = 3;
const TEMP_DIR = '/tmp/uploads';

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

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function logDebug(...args) {
  if (DEBUG_UPLOAD) {
    console.log('[DEBUG_UPLOAD]', ...args);
  }
}

function parseMultipart(req) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: TEMP_DIR,
    maxFileSize: MAX_FILE_SIZE
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

function normalizeFiles(filesRecord) {
  const files = [];
  for (const value of Object.values(filesRecord || {})) {
    if (Array.isArray(value)) {
      files.push(...value);
    } else if (value) {
      files.push(value);
    }
  }
  return files;
}

function isFileAllowed(fileName) {
  const ext = path.extname(fileName || '').toLowerCase();
  return !BLOCKED_EXTENSIONS.has(ext);
}

async function sendMessage(text) {
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
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      { chat_id: CHAT_ID, text: chunk },
      { timeout: TELEGRAM_TIMEOUT_MS }
    );
    lastResponse = response.data;
  }
  return lastResponse;
}

async function sendDocumentWithRetry(filePath, fileName, caption) {
  for (let attempt = 1; attempt <= TELEGRAM_RETRIES; attempt += 1) {
    try {
      if (!fs.existsSync(filePath)) {
        console.error('File missing before Telegram send');
        throw new Error(`Missing file: ${filePath}`);
      }

      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('document', fs.createReadStream(filePath), fileName);
      if (caption) {
        formData.append('caption', caption.slice(0, 1024));
      }

      logDebug('telegram request', { filePath, fileName, attempt });

      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        formData,
        {
          headers: formData.getHeaders(),
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
      await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
    }
  }
  return { ok: false, error: 'Retries exhausted' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filesToCleanup = [];
  try {
    console.log('form received');
    const { fields, files } = await parseMultipart(req);
    const incomingFiles = normalizeFiles(files);

    const validatedFiles = [];
    for (const uploadedFile of incomingFiles) {
      if (!uploadedFile?.filepath || !uploadedFile?.originalFilename) {
        return res.status(400).json({ error: 'Invalid uploaded file' });
      }

      if (uploadedFile.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: 'File too large' });
      }

      if (!isFileAllowed(uploadedFile.originalFilename)) {
        return res.status(400).json({ error: `Blocked file type: ${uploadedFile.originalFilename}` });
      }

      console.log('File received:', {
        name: uploadedFile.originalFilename,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype
      });

      filesToCleanup.push(uploadedFile.filepath);
      validatedFiles.push(uploadedFile);
      console.log('file saved', { filePath: uploadedFile.filepath, fileName: uploadedFile.originalFilename });
    }

    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
    try {
      await sendMessage(message || 'Новая анкета получена');
    } catch (textError) {
      console.error('Text message send failed, continuing with file pipeline:', textError?.response?.data || textError);
    }

    const failed = [];
    for (const file of validatedFiles) {
      const result = await sendDocumentWithRetry(
        file.filepath,
        file.originalFilename,
        `📎 Файл анкеты: ${file.originalFilename}`
      );
      if (!result.ok) {
        failed.push({ file: file.originalFilename, error: result.error });
        await sendMessage(`File upload failed but user submitted: ${file.originalFilename}`);
      }
    }

    if (failed.length > 0 && validatedFiles.length > 0) {
      return res.status(207).json({ ok: false, failed });
    }

    return res.status(200).json({ ok: true, sent: validatedFiles.length, filesReceived: incomingFiles.length });
  } catch (error) {
    console.error('upload pipeline error', error?.response?.data || error);
    return res.status(500).json({
      error: 'Internal upload pipeline error',
      details: DEBUG_UPLOAD ? String(error?.message || error) : undefined
    });
  } finally {
    for (const filePath of filesToCleanup) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file', filePath, cleanupError);
      }
    }
  }
}
