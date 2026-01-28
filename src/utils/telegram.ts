// Интеграция с Telegram Bot API
import { getQuestionnaireById, type Questionnaire, type QuestionField } from '../data/questionnaires';

const TELEGRAM_BOT_TOKEN = '8585413661:AAFZ4Y8F0JLLDfQLFNsbSlsUiB4P3qf22Dc';
const TELEGRAM_CHAT_ID = '-1003086304655';

/**
 * Отправка файла в Telegram
 */
async function sendFileToTelegram(file: File, caption?: string): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', file);
    if (caption) {
      formData.append('caption', caption);
    }
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Telegram file upload error:', responseData);
      return false;
    }
    
    console.log('File sent successfully:', file.name);
    return true;
  } catch (error) {
    console.error('Error sending file to Telegram:', error);
    return false;
  }
}

/**
 * Отправка данных анкеты в Telegram
 * @param questionnaireId - ID анкеты
 * @param formData - Данные формы
 * @returns Promise<boolean> - успешность отправки
 */
export async function sendToTelegram(
  questionnaireId: string,
  formData: Record<string, any>
): Promise<boolean> {
  try {
    // Собираем все файлы из формы
    const files: { file: File; questionLabel: string }[] = [];
    
    for (const [key, value] of Object.entries(formData)) {
      if (!value) continue;
      
      // Обрабатываем FileList
      if (value instanceof FileList) {
        const questionnaire = getQuestionnaireById(questionnaireId);
        const question = questionnaire?.questions.find(q => q.id === key);
        const questionLabel = question?.label || key;
        
        Array.from(value).forEach(file => {
          if (file instanceof File) {
            files.push({ file, questionLabel });
          }
        });
      } 
      // Обрабатываем массив File объектов
      else if (Array.isArray(value) && value.length > 0) {
        const questionnaire = getQuestionnaireById(questionnaireId);
        const question = questionnaire?.questions.find(q => q.id === key);
        const questionLabel = question?.label || key;
        
        value.forEach((item: any) => {
          if (item instanceof File) {
            files.push({ file: item, questionLabel });
          }
        });
      }
      // Обрабатываем одиночный File объект
      else if (value instanceof File) {
        const questionnaire = getQuestionnaireById(questionnaireId);
        const question = questionnaire?.questions.find(q => q.id === key);
        const questionLabel = question?.label || key;
        files.push({ file: value, questionLabel });
      }
    }
    
    console.log(`Found ${files.length} file(s) to send`);
    
    // Формируем структурированное сообщение
    const message = formatQuestionnaireMessage(questionnaireId, formData);
    
    // URL для отправки сообщения через Telegram Bot API
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', responseData);
      return false;
    }
    
    console.log('Message sent successfully:', responseData);
    
    // Отправляем файлы отдельными сообщениями
    if (files.length > 0) {
      console.log(`Sending ${files.length} file(s)...`);
      
      for (let i = 0; i < files.length; i++) {
        const { file, questionLabel } = files[i];
        const fileCaption = `📎 Файл ${i + 1}/${files.length} из вопроса: ${questionLabel}\nИмя файла: ${file.name}`;
        
        const fileSent = await sendFileToTelegram(file, fileCaption);
        if (!fileSent) {
          console.warn(`Failed to send file: ${file.name}`);
        }
        
        // Небольшая задержка между отправками, чтобы не превысить лимиты API
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      console.log('All files sent');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}

/**
 * Форматирование данных анкеты в читаемое сообщение
 */
function formatQuestionnaireMessage(
  questionnaireId: string,
  formData: Record<string, any>
): string {
  const questionnaireNames: Record<string, string> = {
    babies: 'Малыши до 1 года',
    children: 'Детская анкета (1–12 лет)',
    female: 'Женская анкета',
    male: 'Мужская анкета'
  };
  
  let message = `<b>📋 Новая анкета: ${questionnaireNames[questionnaireId] || questionnaireId}</b>\n\n`;
  message += `<b>📅 Дата:</b> ${new Date().toLocaleString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Обрабатываем составные поля (имя, фамилия, возраст, вес)
  const name = formData['q1_name'] || '';
  const surname = formData['q1_surname'] || '';
  const age = formData['q1_age'] || '';
  const weight = formData['q1_weight'] || '';
  const height = formData['q1_height'] || '';
  
  if (name || surname || age || weight) {
    message += `<b>👤 Основная информация:</b>\n`;
    if (name) message += `Имя: ${name}\n`;
    if (surname) message += `Фамилия: ${surname}\n`;
    if (age) message += `Возраст: ${age}\n`;
    if (weight) message += `Вес: ${weight} кг\n`;
    if (height) message += `Рост: ${height} см\n`;
    message += `\n`;
  }
  
  // Добавляем контактные данные в конец
  const telegram = formData['contact_telegram'] || '';
  const instagram = formData['contact_instagram'] || '';
  
  // Добавляем остальные ответы
  const processedKeys = new Set(['q1_name', 'q1_surname', 'q1_age', 'q1_weight', 'q1_height', 'contact_telegram', 'contact_instagram']);
  
  // Определяем, с какого вопроса начинать нумерацию
  // Для женской и мужской анкет - с q1_weight_goal
  // Для детских анкет - с q2 (первый вопрос после основной информации)
  let startNumberingFrom = 'q1_weight_goal';
  if (questionnaireId === 'babies' || questionnaireId === 'children') {
    startNumberingFrom = 'q2';
  }
  
  let questionNumber = 0;
  let shouldNumber = false;
  
  // Получаем все вопросы анкеты в правильном порядке для нумерации
  const questionnaire = getQuestionnaireById(questionnaireId);
  const orderedQuestions: { id: string; label: string }[] = [];
  
  if (questionnaire) {
    const collectQuestions = (fields: QuestionField[]) => {
      fields.forEach(field => {
        // Добавляем основной вопрос
        orderedQuestions.push({ id: field.id, label: field.label });
        
        // Добавляем составные поля
        if (field.groupedFields) {
          field.groupedFields.forEach(subField => {
            orderedQuestions.push({ id: subField.id, label: subField.label });
          });
        }
        
        // Добавляем условные поля (они будут показаны только если условие выполнено)
        if (field.conditionalFields) {
          field.conditionalFields.forEach(cond => {
            const conditionValue = formData[cond.condition.fieldId];
            if (conditionValue === cond.condition.value) {
              collectQuestions(cond.fields);
            }
          });
        }
      });
    };
    collectQuestions(questionnaire.questions);
  }
  
  // Находим индекс вопроса, с которого начинать нумерацию
  const numberingStartIndex = orderedQuestions.findIndex(q => q.id === startNumberingFrom);
  
  // Создаем мапу для быстрого поиска порядка вопросов
  const questionOrderMap = new Map<string, number>();
  orderedQuestions.forEach((q, index) => {
    questionOrderMap.set(q.id, index);
  });
  
  // Сортируем ответы по порядку вопросов в анкете
  const sortedEntries = Object.entries(formData)
    .filter(([key, value]) => {
      return !processedKeys.has(key) && 
             value !== null && 
             value !== undefined && 
             value !== '' &&
             !key.endsWith('_other');
    })
    .sort(([keyA], [keyB]) => {
      const orderA = questionOrderMap.get(keyA) ?? 9999;
      const orderB = questionOrderMap.get(keyB) ?? 9999;
      return orderA - orderB;
    });
  
  for (const [key, value] of sortedEntries) {
    // Определяем, нужно ли нумеровать этот вопрос
    const questionIndex = questionOrderMap.get(key) ?? -1;
    if (questionIndex >= numberingStartIndex && numberingStartIndex !== -1) {
      shouldNumber = true;
      questionNumber++;
    }
    
    // Получаем вопрос из данных анкеты
    const questionLabel = getQuestionLabel(key, questionnaireId);
    const numberedLabel = shouldNumber ? `${questionNumber}. ${questionLabel}` : questionLabel;
    message += `<b>${numberedLabel}:</b>\n`;
    
    if (Array.isArray(value)) {
      // Обрабатываем checkbox значения
      const questionnaire = getQuestionnaireById(questionnaireId);
      const question = questionnaire?.questions.find(q => q.id === key);
      
      const values = value.filter(v => v !== 'other' && v !== 'none');
      if (values.length > 0) {
        // Если есть опции, используем их метки
        if (question?.options) {
          const optionLabels = values.map(v => {
            const option = question.options?.find(opt => opt.value === v);
            return option ? option.label : v;
          });
          message += optionLabels.map(v => `• ${v}`).join('\n') + '\n';
        } else {
          message += values.map(v => `• ${v}`).join('\n') + '\n';
        }
      }
      // Добавляем "Другое" если есть
      if (value.includes('other') && formData[`${key}_other`]) {
        message += `• Другое: ${formData[`${key}_other`]}\n`;
      }
      if (value.includes('none')) {
        message += `• Не беспокоит\n`;
      }
    } else if (value instanceof FileList || (Array.isArray(value) && value.length > 0 && value[0] instanceof File)) {
      // Обрабатываем файлы
      const files = value instanceof FileList ? Array.from(value) : value;
      message += `📎 Загружено файлов: ${files.length}\n`;
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as File;
        message += `   ${i + 1}. ${file.name} (${(file.size / 1024).toFixed(1)} KB)\n`;
      }
    } else {
      // Обрабатываем radio и select значения
      const questionnaire = getQuestionnaireById(questionnaireId);
      const question = questionnaire?.questions.find(q => q.id === key);
      
      if (question?.options) {
        const option = question.options.find(opt => opt.value === value);
        if (option) {
          message += `${option.label}\n`;
        } else {
          message += `${value}\n`;
        }
      } else {
        message += `${value}\n`;
      }
    }
    message += `\n`;
  }
  
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `<b>📞 Контактные данные для связи:</b>\n`;
  if (telegram) {
    message += `💬 Telegram: ${telegram}\n`;
  }
  if (instagram) {
    message += `📷 Instagram: @${instagram}\n`;
  }
  if (!telegram && !instagram) {
    message += `Не указаны\n`;
  }
  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `<i>Анкета заполнена через сайт</i>`;
  
  return message;
}

/**
 * Получить текст вопроса по ID поля
 */
function getQuestionLabel(fieldId: string, questionnaireId: string): string {
  const questionnaire = getQuestionnaireById(questionnaireId);
  
  if (questionnaire) {
    // Ищем поле в основных вопросах
    const findField = (fields: QuestionField[]): string | null => {
      for (const field of fields) {
        if (field.id === fieldId) {
          return field.label;
        }
        // Проверяем составные поля
        if (field.groupedFields) {
          const subField = field.groupedFields.find(f => f.id === fieldId);
          if (subField) {
            return subField.label;
          }
        }
        // Проверяем условные поля
        if (field.conditionalFields) {
          for (const cond of field.conditionalFields) {
            const found = findField(cond.fields);
            if (found) return found;
          }
        }
      }
      return null;
    };
    
    const label = findField(questionnaire.questions);
    if (label) return label;
  }
  
  // Fallback: простое форматирование ID
  const label = fieldId
    .replace(/^q\d+_?/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
  
  return label || fieldId;
}

/**
 * Экспорт данных в JSON формат
 */
export function exportToJSON(
  questionnaireId: string,
  formData: Record<string, any>
): string {
  const data = {
    questionnaireId,
    timestamp: new Date().toISOString(),
    answers: formData
  };
  
  return JSON.stringify(data, null, 2);
}

