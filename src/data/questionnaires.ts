// Структура данных для всех анкет
// ВАЖНО: Используются строго указанные вопросы без изменений

export type FieldType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'file' | 'number' | 'group';

export interface FieldOption {
  value: string;
  label: string;
  hasOther?: boolean; // Если true, при выборе этого варианта показывается текстовое поле "Другое"
}

export interface ConditionalField {
  condition: {
    fieldId: string;
    value: string; // Значение, при котором показывается поле
  };
  fields: QuestionField[];
}

// Составное поле (группа полей)
export interface GroupedField {
  id: string;
  type: 'text' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  unit?: string; // Единица измерения (кг, см, лет и т.д.)
}

export interface QuestionField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  conditionalFields?: ConditionalField[];
  accept?: string; // Для file upload
  multiple?: boolean; // Для file upload
  min?: number; // Для number
  max?: number; // Для number
  unit?: string; // Единица измерения для числовых полей
  // Для составных полей (group)
  groupedFields?: GroupedField[];
  // Для checkbox с вариантом "Другое"
  allowOther?: boolean;
  otherLabel?: string; // Текст для поля "Другое"
}

export interface Questionnaire {
  id: string;
  name: {
    ru: string;
    en: string;
  };
  questions: QuestionField[];
}

// Анкета: Малыши до 1 года
export const babiesQuestionnaire: Questionnaire = {
  id: 'babies',
  name: {
    ru: 'Малыши до 1 года',
    en: 'Babies up to 1 year'
  },
  questions: [
    {
      id: 'q1',
      type: 'group',
      label: 'Основная информация о ребёнке',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', required: true, placeholder: 'Имя ребёнка' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', required: true, placeholder: 'Фамилия ребёнка' },
        { id: 'q1_age', type: 'number', label: 'Возраст', required: true, placeholder: 'Возраст в месяцах', unit: 'месяцев', min: 0, max: 12 },
        { id: 'q1_weight', type: 'number', label: 'Вес', required: true, placeholder: 'Вес', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q2',
      type: 'checkbox',
      label: 'Пищеварение — боли в животе, диарея, запор',
      options: [
        { value: 'stomach_pain', label: 'Боли в животе' },
        { value: 'diarrhea', label: 'Диарея' },
        { value: 'constipation', label: 'Запор' },
        { value: 'bloating', label: 'Вздутие' },
        { value: 'none', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с пищеварением'
    },
    {
      id: 'q3',
      type: 'radio',
      label: 'Потеет ли во сне',
      required: true,
      options: [
        { value: 'no', label: 'Нет' },
        { value: 'sometimes', label: 'Иногда' },
        { value: 'often', label: 'Часто' },
        { value: 'always', label: 'Постоянно' }
      ]
    },
    {
      id: 'q4',
      type: 'radio',
      label: 'Есть ли неприятный запах изо рта',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      label: 'Родинки, бородавки, высыпания, экземы',
      options: [
        { value: 'moles', label: 'Родинки' },
        { value: 'warts', label: 'Бородавки' },
        { value: 'rash', label: 'Высыпания' },
        { value: 'eczema', label: 'Экземы' },
        { value: 'none', label: 'Нет' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие кожные проявления'
    },
    {
      id: 'q6',
      type: 'checkbox',
      label: 'Аллергия (цветение, животные, пыль, еда)',
      options: [
        { value: 'pollen', label: 'Цветение' },
        { value: 'animals', label: 'Животные' },
        { value: 'dust', label: 'Пыль' },
        { value: 'food', label: 'Еда' },
        { value: 'none', label: 'Нет аллергии' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие виды аллергии'
    },
    {
      id: 'q7',
      type: 'number',
      label: 'Сколько воды в день пьёт ребёнок',
      placeholder: 'Количество воды',
      unit: 'мл',
      min: 0
    },
    {
      id: 'q8',
      type: 'textarea',
      label: 'Травмы, операции, удары по голове, падения, переломы',
      placeholder: 'Опишите, если были'
    },
    {
      id: 'q9',
      type: 'textarea',
      label: 'Как ребёнок спит',
      placeholder: 'Опишите режим и качество сна'
    },
    {
      id: 'q10',
      type: 'checkbox',
      label: 'Часто ли болеет, принимал ли антибиотики или лекарства',
      options: [
        { value: 'often_sick', label: 'Часто болеет' },
        { value: 'antibiotics', label: 'Принимал антибиотики' },
        { value: 'medications', label: 'Принимал лекарства' },
        { value: 'none', label: 'Не болеет, не принимал' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите дополнительную информацию'
    },
    {
      id: 'q11',
      type: 'radio',
      label: 'Как прошли роды',
      required: true,
      options: [
        { value: 'natural', label: 'Естественные' },
        { value: 'cesarean', label: 'Кесарево' }
      ]
    },
    {
      id: 'q12',
      type: 'radio',
      label: 'Был ли у мамы токсикоз',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q13',
      type: 'radio',
      label: 'Была ли у мамы аллергия',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q14',
      type: 'radio',
      label: 'Был ли у мамы запор',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q15',
      type: 'radio',
      label: 'Принимала ли мама антибиотики',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q16',
      type: 'radio',
      label: 'Была ли анемия',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q17',
      type: 'textarea',
      label: 'Проблемы во время беременности',
      placeholder: 'Опишите, если были'
    },
    {
      id: 'q18',
      type: 'textarea',
      label: 'Что ещё важно знать о здоровье ребёнка',
      placeholder: 'Дополнительная информация'
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      placeholder: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      placeholder: 'username',
      required: false
    }
  ]
};

// Анкета: Детская (1–12 лет)
export const childrenQuestionnaire: Questionnaire = {
  id: 'children',
  name: {
    ru: 'Детская анкета (1–12 лет)',
    en: 'Children\'s questionnaire (1–12 years)'
  },
  questions: [
    {
      id: 'q1',
      type: 'group',
      label: 'Основная информация о ребёнке',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', required: true, placeholder: 'Имя ребёнка' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', required: true, placeholder: 'Фамилия ребёнка' },
        { id: 'q1_age', type: 'number', label: 'Возраст', required: true, placeholder: 'Возраст', unit: 'лет', min: 1, max: 12 },
        { id: 'q1_weight', type: 'number', label: 'Вес', required: true, placeholder: 'Вес', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q2',
      type: 'checkbox',
      label: 'Пищеварение — боли, диарея, запор',
      options: [
        { value: 'stomach_pain', label: 'Боли в животе' },
        { value: 'diarrhea', label: 'Диарея' },
        { value: 'constipation', label: 'Запор' },
        { value: 'bloating', label: 'Вздутие' },
        { value: 'none', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с пищеварением'
    },
    {
      id: 'q3',
      type: 'radio',
      label: 'Зубы — быстро портятся',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q4',
      type: 'radio',
      label: 'Потеет во сне, скрипит зубами',
      required: true,
      options: [
        { value: 'both', label: 'И то, и другое' },
        { value: 'sweats', label: 'Только потеет' },
        { value: 'teeth', label: 'Только скрипит зубами' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q5',
      type: 'radio',
      label: 'Неприятный запах изо рта',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q6',
      type: 'radio',
      label: 'Зависимость от сладкого и снеков',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' },
        { value: 'sometimes', label: 'Иногда' }
      ]
    },
    {
      id: 'q7',
      type: 'checkbox',
      label: 'Родинки, бородавки, высыпания, экземы',
      options: [
        { value: 'moles', label: 'Родинки' },
        { value: 'warts', label: 'Бородавки' },
        { value: 'rash', label: 'Высыпания' },
        { value: 'eczema', label: 'Экземы' },
        { value: 'none', label: 'Нет' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие кожные проявления'
    },
    {
      id: 'q8',
      type: 'checkbox',
      label: 'Аллергия',
      options: [
        { value: 'pollen', label: 'Цветение' },
        { value: 'animals', label: 'Животные' },
        { value: 'dust', label: 'Пыль' },
        { value: 'food', label: 'Еда' },
        { value: 'medications', label: 'Лекарства' },
        { value: 'none', label: 'Нет аллергии' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие виды аллергии'
    },
    {
      id: 'q9',
      type: 'radio',
      label: 'Гиперактивность или усталость',
      required: true,
      options: [
        { value: 'hyperactive', label: 'Гиперактивность' },
        { value: 'tired', label: 'Усталость' },
        { value: 'both', label: 'И то, и другое' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q10',
      type: 'number',
      label: 'Сколько воды пьёт в день',
      placeholder: 'Количество воды',
      unit: 'мл',
      min: 0
    },
    {
      id: 'q11',
      type: 'textarea',
      label: 'Травмы, операции, падения',
      placeholder: 'Опишите, если были'
    },
    {
      id: 'q12',
      type: 'textarea',
      label: 'Головные боли, плохой сон',
      placeholder: 'Опишите частоту и характер'
    },
    {
      id: 'q13',
      type: 'checkbox',
      label: 'Часто ли болеет, антибиотики',
      options: [
        { value: 'often_sick', label: 'Часто болеет' },
        { value: 'antibiotics', label: 'Принимал антибиотики' },
        { value: 'none', label: 'Не болеет, не принимал' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите дополнительную информацию'
    },
    {
      id: 'q14',
      type: 'textarea',
      label: 'Что ещё важно знать о здоровье ребёнка',
      placeholder: 'Дополнительная информация'
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      placeholder: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      placeholder: 'username',
      required: false
    }
  ]
};

// Анкета: Женская (28 вопросов)
export const femaleQuestionnaire: Questionnaire = {
  id: 'female',
  name: {
    ru: 'Женская анкета',
    en: 'Female questionnaire'
  },
  questions: [
    {
      id: 'q1',
      type: 'group',
      label: 'Основная информация',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', required: true, placeholder: 'Имя' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', required: true, placeholder: 'Фамилия' },
        { id: 'q1_age', type: 'number', label: 'Возраст', required: true, placeholder: 'Возраст', unit: 'лет', min: 0 },
        { id: 'q1_weight', type: 'number', label: 'Вес', required: true, placeholder: 'Вес', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q1_height',
      type: 'number',
      label: 'Рост',
      required: true,
      placeholder: 'Рост',
      unit: 'см',
      min: 0
    },
    {
      id: 'q1_weight_goal',
      type: 'text',
      label: 'Если недовольны своим весом – сколько хотите убрать или добавить',
      placeholder: 'Например: хочу убрать 5 кг или добавить 3 кг'
    },
    {
      id: 'q2',
      type: 'number',
      label: 'Сколько воды в день Вы пьете? (не чай, не кофе, не другие напитки, а только вода)',
      required: true,
      placeholder: 'Количество воды',
      unit: 'литров',
      min: 0
    },
    {
      id: 'q3',
      type: 'textarea',
      label: 'Был ли ковид (сколько раз) или вакцина от ковид (сколько доз)',
      placeholder: 'Опишите подробно. Были ли осложнения после ковид: выпадение волос, проблемы сердца, суставы, потеря памяти, панические атаки, ухудшение сна и т.д.'
    },
    {
      id: 'q4',
      type: 'checkbox',
      label: 'Волосы',
      options: [
        { value: 'satisfied', label: 'Довольны качеством' },
        { value: 'hair_loss', label: 'Агрессивно выпадают' },
        { value: 'dry', label: 'Сухие' },
        { value: 'oily', label: 'Жирные' },
        { value: 'brittle', label: 'Ломкие' },
        { value: 'none', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      label: 'Зубы',
      options: [
        { value: 'crumbling', label: 'Быстро крошатся или портятся' },
        { value: 'bad_breath', label: 'Неприятный запах изо рта' },
        { value: 'bleeding_gums', label: 'Кровоточат десны' },
        { value: 'none', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q6',
      type: 'checkbox',
      label: 'Пищеварение',
      options: [
        { value: 'heartburn', label: 'Изжога' },
        { value: 'bitterness', label: 'Горечь во рту' },
        { value: 'bloating', label: 'Вздутие' },
        { value: 'heaviness', label: 'Тяжесть в желудке' },
        { value: 'gas', label: 'Газы' },
        { value: 'diarrhea', label: 'Диарея' },
        { value: 'constipation', label: 'Запор' },
        { value: 'pancreatitis', label: 'Панкреатит' },
        { value: 'none', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q7',
      type: 'textarea',
      label: 'Песок или камни в желчном или почках. Если есть камни, указать размер',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q8',
      type: 'textarea',
      label: 'Были ли операции (какие именно), все ли органы на месте (какой орган удален), травмы',
      placeholder: 'Опишите подробно'
    },
    {
      id: 'q9',
      type: 'select',
      label: 'Давление',
      options: [
        { value: 'high', label: 'Высокое' },
        { value: 'low', label: 'Низкое' },
        { value: 'normal', label: 'Нормальное' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q9', value: 'high' },
        fields: [{
          id: 'q9_meds',
          type: 'radio',
          label: 'Пьете ли лекарства от давления',
          required: true,
          options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' }
          ]
        }, {
          id: 'q9_meds_duration',
          type: 'text',
          label: 'Как долго принимаете лекарства',
          placeholder: 'Например: 2 года',
          required: true,
          conditionalFields: [{
            condition: { fieldId: 'q9_meds', value: 'yes' },
            fields: []
          }]
        }]
      }]
    },
    {
      id: 'q10',
      type: 'checkbox',
      label: 'Есть ли хронические или аутоиммунные заболевания',
      options: [
        { value: 'diabetes', label: 'Диабет' },
        { value: 'thyroiditis', label: 'Аутоиммунный тиреоидит' },
        { value: 'arthritis', label: 'Артрит' },
        { value: 'psoriasis', label: 'Псориаз' },
        { value: 'none', label: 'Нет' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие заболевания'
    },
    {
      id: 'q11',
      type: 'checkbox',
      label: 'Головные боли, мигрени, метеозависимость, сотрясение мозга, удары по голове, шум в ушах, мушки перед глазами, головокружения',
      options: [
        { value: 'headaches', label: 'Головные боли' },
        { value: 'migraines', label: 'Мигрени' },
        { value: 'weather', label: 'Метеозависимость' },
        { value: 'concussion', label: 'Сотрясение мозга' },
        { value: 'head_injury', label: 'Удары по голове' },
        { value: 'tinnitus', label: 'Шум в ушах' },
        { value: 'floaters', label: 'Мушки перед глазами' },
        { value: 'dizziness', label: 'Головокружения' },
        { value: 'none', label: 'Нет' }
      ]
    },
    {
      id: 'q12',
      type: 'radio',
      label: 'Онемение пальцев рук и ног, руки-ноги холодные даже летом',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ]
    },
    {
      id: 'q13',
      type: 'textarea',
      label: 'Варикоз (сеточка или выраженные вены), геморрой (кровоточит или нет), пигментные пятна',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q14',
      type: 'checkbox',
      label: 'Суставы',
      options: [
        { value: 'creaking', label: 'Скрипят' },
        { value: 'crunching', label: 'Хрустят' },
        { value: 'inflammation', label: 'Воспаляются' },
        { value: 'arthrosis', label: 'Артроз' },
        { value: 'back_pain', label: 'Боли в спине' },
        { value: 'lower_back_pain', label: 'Боли в пояснице' },
        { value: 'knee_pain', label: 'Боли в коленях' },
        { value: 'none', label: 'Нет проблем' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с суставами'
    },
    {
      id: 'q15',
      type: 'textarea',
      label: 'Кисты, полипы, миомы, опухоли, грыжи',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q16',
      type: 'textarea',
      label: 'Герпес, папилломы, родинки, бородавки, красные точечки на коже, выделения, цистит',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q17',
      type: 'checkbox',
      label: 'Женские дни',
      options: [
        { value: 'irregular', label: 'Нерегулярные' },
        { value: 'painful', label: 'Болезненные' },
        { value: 'prolonged', label: 'Затяжные' },
        { value: 'heavy_bleeding', label: 'Обильные кровотечения' },
        { value: 'menopause', label: 'Менопауза' },
        { value: 'none', label: 'Нет проблем' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите дополнительную информацию'
    },
    {
      id: 'q18',
      type: 'textarea',
      label: 'Прыщи, фурункулы, акне, раздражение, розацеа, псориаз, дерматит, экзема',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q19',
      type: 'checkbox',
      label: 'Аллергия (на пыльцу, еду, шерсть животных, пыль, лекарства)',
      options: [
        { value: 'pollen', label: 'Пыльца' },
        { value: 'food', label: 'Еда' },
        { value: 'animals', label: 'Шерсть животных' },
        { value: 'dust', label: 'Пыль' },
        { value: 'medications', label: 'Лекарства' },
        { value: 'none', label: 'Нет аллергии' }
      ]
    },
    {
      id: 'q20',
      type: 'textarea',
      label: 'Простуды',
      placeholder: 'Сколько раз за год простужаетесь. Пользуетесь ли антибиотиками и жаропонижающими'
    },
    {
      id: 'q21',
      type: 'checkbox',
      label: 'Сон',
      options: [
        { value: 'hard_to_sleep', label: 'Трудно заснуть' },
        { value: 'wake_up_often', label: 'Часто просыпаетесь ночью' },
        { value: 'both', label: 'И то, и другое' },
        { value: 'no', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q22',
      type: 'checkbox',
      label: 'Энергия',
      options: [
        { value: 'hard_morning', label: 'С утра нужно собрать себя по кусочкам' },
        { value: 'very_hard_wake', label: 'Очень тяжело просыпаться' },
        { value: 'tired_morning', label: 'Утром чувствуете себя неотдохнувшим' },
        { value: 'need_coffee', label: 'Нужно стимулировать себя кофе' },
        { value: 'all', label: 'Все перечисленное' },
        { value: 'no', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q23',
      type: 'checkbox',
      label: 'Память',
      options: [
        { value: 'slow', label: 'Притормаживает' },
        { value: 'concentration', label: 'Трудно сконцентрироваться на каком-то деле' },
        { value: 'remember_names', label: 'Трудно вспомнить имена и события' },
        { value: 'remember_info', label: 'Трудно запомнить информацию' },
        { value: 'all', label: 'Все перечисленное' },
        { value: 'no', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q24',
      type: 'checkbox',
      label: 'Какой у вас образ жизни',
      options: [
        { value: 'sedentary', label: 'Сидячий' },
        { value: 'regular_sport', label: 'Занимаетесь регулярно спортом' },
        { value: 'home_gym', label: 'Делаете дома гимнастику' },
        { value: 'cold_water', label: 'Обливаетесь холодной водой' },
        { value: 'stressful', label: 'Работаете в стрессовых условиях' },
        { value: 'physical_work', label: 'Работа связана с физическими нагрузками' },
        { value: 'toxic_substances', label: 'Вдыхаете на работе токсичные вещества (парикмахер, мастер маникюра/педикюра, строитель, регулярно дышите краской (маляр, автомаляр) и др.)' }
      ]
    },
    {
      id: 'q25',
      type: 'radio',
      label: 'Принимаете ли лекарства на постоянной основе (если да - напишите название, если это возможно)',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q25', value: 'yes' },
        fields: [{
          id: 'q25_meds',
          type: 'textarea',
          label: 'Название лекарств',
          placeholder: 'Перечислите названия лекарств, которые принимаете постоянно',
          required: true
        }]
      }]
    },
    {
      id: 'q26',
      type: 'radio',
      label: 'Есть ли у вас анализы крови за последние 2-3 месяца? УЗИ?',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q26', value: 'yes' },
        fields: [{
          id: 'q26_files',
          type: 'file',
          label: 'Загрузите анализы (любые форматы)',
          accept: '*',
          multiple: true,
          required: true
        }]
      }]
    },
    {
      id: 'q27',
      type: 'textarea',
      label: 'Что еще Вы хотели бы добавить о своем здоровье',
      placeholder: 'Дополнительная информация'
    },
    {
      id: 'q28',
      type: 'textarea',
      label: 'Какой самый важный вопрос вас волнует в первую очередь',
      placeholder: 'Опишите главную проблему или вопрос',
      required: true
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      placeholder: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      placeholder: 'username',
      required: false
    }
  ]
};

// Анкета: Мужская (28 вопросов)
export const maleQuestionnaire: Questionnaire = {
  id: 'male',
  name: {
    ru: 'Мужская анкета',
    en: 'Male questionnaire'
  },
  questions: [
    {
      id: 'q1',
      type: 'group',
      label: 'Основная информация',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', required: true, placeholder: 'Имя' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', required: true, placeholder: 'Фамилия' },
        { id: 'q1_age', type: 'number', label: 'Возраст', required: true, placeholder: 'Возраст', unit: 'лет', min: 0 },
        { id: 'q1_weight', type: 'number', label: 'Вес', required: true, placeholder: 'Вес', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q1_height',
      type: 'number',
      label: 'Рост',
      required: true,
      placeholder: 'Рост',
      unit: 'см',
      min: 0
    },
    {
      id: 'q1_weight_goal',
      type: 'text',
      label: 'Если недовольны своим весом – сколько хотите убрать или добавить',
      placeholder: 'Например: хочу убрать 10 кг или добавить 5 кг'
    },
    {
      id: 'q2',
      type: 'number',
      label: 'Сколько воды в день Вы пьете? (не чай, не кофе, не другие напитки, а только вода)',
      required: true,
      placeholder: 'Количество воды',
      unit: 'литров',
      min: 0
    },
    {
      id: 'q3',
      type: 'textarea',
      label: 'Был ли ковид (сколько раз) или вакцина от ковид (сколько доз)',
      placeholder: 'Опишите подробно. Были ли осложнения после ковид: выпадение волос, проблемы сердца, суставы, потеря памяти, панические атаки, ухудшение сна и т.д.'
    },
    {
      id: 'q4',
      type: 'checkbox',
      label: 'Волосы',
      options: [
        { value: 'satisfied', label: 'Довольны качеством' },
        { value: 'hair_loss', label: 'Агрессивно выпадают' },
        { value: 'dry', label: 'Сухие' },
        { value: 'oily', label: 'Жирные' },
        { value: 'brittle', label: 'Ломкие' },
        { value: 'none', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      label: 'Зубы',
      options: [
        { value: 'crumbling', label: 'Быстро крошатся или портятся' },
        { value: 'bad_breath', label: 'Неприятный запах изо рта' },
        { value: 'bleeding_gums', label: 'Кровоточат десны' },
        { value: 'none', label: 'Нет проблем' }
      ]
    },
    {
      id: 'q6',
      type: 'checkbox',
      label: 'Пищеварение',
      options: [
        { value: 'heartburn', label: 'Изжога' },
        { value: 'bitterness', label: 'Горечь во рту' },
        { value: 'bloating', label: 'Вздутие' },
        { value: 'heaviness', label: 'Тяжесть в желудке' },
        { value: 'gas', label: 'Газы' },
        { value: 'diarrhea', label: 'Диарея' },
        { value: 'constipation', label: 'Запор' },
        { value: 'pancreatitis', label: 'Панкреатит' },
        { value: 'none', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с пищеварением'
    },
    {
      id: 'q7',
      type: 'textarea',
      label: 'Песок или камни в желчном или почках. Если есть камни, указать размер',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q8',
      type: 'textarea',
      label: 'Были ли операции (какие именно), все ли органы на месте (какой орган удален), травмы',
      placeholder: 'Опишите подробно'
    },
    {
      id: 'q9',
      type: 'select',
      label: 'Давление',
      options: [
        { value: 'high', label: 'Высокое' },
        { value: 'low', label: 'Низкое' },
        { value: 'normal', label: 'Нормальное' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q9', value: 'high' },
        fields: [{
          id: 'q9_meds',
          type: 'radio',
          label: 'Пьете ли лекарства от давления',
          required: true,
          options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' }
          ]
        }, {
          id: 'q9_meds_duration',
          type: 'text',
          label: 'Как долго принимаете лекарства',
          placeholder: 'Например: 3 года',
          required: true,
          conditionalFields: [{
            condition: { fieldId: 'q9_meds', value: 'yes' },
            fields: []
          }]
        }]
      }]
    },
    {
      id: 'q10',
      type: 'checkbox',
      label: 'Есть ли хронические или аутоиммунные заболевания',
      options: [
        { value: 'diabetes', label: 'Диабет' },
        { value: 'thyroiditis', label: 'Аутоиммунный тиреоидит' },
        { value: 'arthritis', label: 'Артрит' },
        { value: 'psoriasis', label: 'Псориаз' },
        { value: 'none', label: 'Нет' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие заболевания'
    },
    {
      id: 'q11',
      type: 'checkbox',
      label: 'Головные боли, мигрени, метеозависимость, сотрясение мозга, удары по голове, шум в ушах, мушки перед глазами, головокружения',
      options: [
        { value: 'headaches', label: 'Головные боли' },
        { value: 'migraines', label: 'Мигрени' },
        { value: 'weather', label: 'Метеозависимость' },
        { value: 'concussion', label: 'Сотрясение мозга' },
        { value: 'head_injury', label: 'Удары по голове' },
        { value: 'tinnitus', label: 'Шум в ушах' },
        { value: 'floaters', label: 'Мушки перед глазами' },
        { value: 'dizziness', label: 'Головокружения' },
        { value: 'none', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы'
    },
    {
      id: 'q12',
      type: 'radio',
      label: 'Онемение пальцев рук и ног, руки-ноги холодные даже летом',
      required: true,
      options: [
        { value: 'no', label: 'Нет' },
        { value: 'sometimes', label: 'Иногда' },
        { value: 'often', label: 'Часто' },
        { value: 'always', label: 'Постоянно' }
      ]
    },
    {
      id: 'q13',
      type: 'textarea',
      label: 'Варикоз (сеточка или выраженные вены), геморрой (кровоточит или нет), пигментные пятна',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q14',
      type: 'checkbox',
      label: 'Суставы',
      options: [
        { value: 'creaking', label: 'Скрипят' },
        { value: 'crunching', label: 'Хрустят' },
        { value: 'inflammation', label: 'Воспаляются' },
        { value: 'arthrosis', label: 'Артроз' },
        { value: 'back_pain', label: 'Боли в спине' },
        { value: 'lower_back_pain', label: 'Боли в пояснице' },
        { value: 'knee_pain', label: 'Боли в коленях' },
        { value: 'none', label: 'Нет проблем' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с суставами'
    },
    {
      id: 'q15',
      type: 'textarea',
      label: 'Кисты, полипы, миомы, опухоли, грыжи',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q16',
      type: 'textarea',
      label: 'Герпес, папилломы, родинки, бородавки, красные точечки на коже, выделения, цистит',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q17',
      type: 'textarea',
      label: 'Простатит',
      placeholder: 'Опишите, если есть проблемы'
    },
    {
      id: 'q18',
      type: 'textarea',
      label: 'Прыщи, фурункулы, акне, раздражение, розацеа, псориаз, дерматит, экзема',
      placeholder: 'Опишите, если есть'
    },
    {
      id: 'q19',
      type: 'checkbox',
      label: 'Аллергия (на пыльцу, еду, шерсть животных, пыль, лекарства)',
      options: [
        { value: 'pollen', label: 'Пыльца' },
        { value: 'food', label: 'Еда' },
        { value: 'animals', label: 'Шерсть животных' },
        { value: 'dust', label: 'Пыль' },
        { value: 'medications', label: 'Лекарства' },
        { value: 'none', label: 'Нет аллергии' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие виды аллергии'
    },
    {
      id: 'q20',
      type: 'textarea',
      label: 'Простуды',
      placeholder: 'Сколько раз за год простужаетесь. Пользуетесь ли антибиотиками и жаропонижающими'
    },
    {
      id: 'q21',
      type: 'checkbox',
      label: 'Сон',
      options: [
        { value: 'hard_to_sleep', label: 'Трудно заснуть' },
        { value: 'wake_up_often', label: 'Часто просыпаетесь ночью' },
        { value: 'both', label: 'И то, и другое' },
        { value: 'no', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы со сном'
    },
    {
      id: 'q22',
      type: 'checkbox',
      label: 'Энергия',
      options: [
        { value: 'hard_morning', label: 'С утра нужно собрать себя по кусочкам' },
        { value: 'very_hard_wake', label: 'Очень тяжело просыпаться' },
        { value: 'tired_morning', label: 'Утром чувствуете себя неотдохнувшим' },
        { value: 'need_coffee', label: 'Нужно стимулировать себя кофе' },
        { value: 'all', label: 'Все перечисленное' },
        { value: 'no', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с энергией'
    },
    {
      id: 'q23',
      type: 'checkbox',
      label: 'Память',
      options: [
        { value: 'slow', label: 'Притормаживает' },
        { value: 'concentration', label: 'Трудно сконцентрироваться на каком-то деле' },
        { value: 'remember_names', label: 'Трудно вспомнить имена и события' },
        { value: 'remember_info', label: 'Трудно запомнить информацию' },
        { value: 'all', label: 'Все перечисленное' },
        { value: 'no', label: 'Не беспокоит' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с памятью'
    },
    {
      id: 'q24',
      type: 'checkbox',
      label: 'Какой у вас образ жизни',
      options: [
        { value: 'sedentary', label: 'Сидячий' },
        { value: 'regular_sport', label: 'Регулярно занимаетесь спортом' },
        { value: 'home_gym', label: 'Делаете дома гимнастику' },
        { value: 'cold_water', label: 'Обливаетесь холодной водой' },
        { value: 'stressful', label: 'Работаете в стрессовых условиях' },
        { value: 'physical_work', label: 'Работа связана с физическими нагрузками' },
        { value: 'toxic_substances', label: 'Вдыхаете токсичные вещества на работе' },
        { value: 'other', label: 'Другое', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие особенности образа жизни'
    },
    {
      id: 'q25',
      type: 'radio',
      label: 'Принимаете ли лекарства на постоянной основе (если да - напишите название, если это возможно)',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q25', value: 'yes' },
        fields: [{
          id: 'q25_meds',
          type: 'textarea',
          label: 'Название лекарств',
          placeholder: 'Перечислите названия лекарств, которые принимаете постоянно',
          required: true
        }]
      }]
    },
    {
      id: 'q26',
      type: 'radio',
      label: 'Есть ли у вас анализы крови за последние 2-3 месяца? УЗИ?',
      required: true,
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q26', value: 'yes' },
        fields: [{
          id: 'q26_files',
          type: 'file',
          label: 'Загрузите анализы (любые форматы)',
          accept: '*',
          multiple: true,
          required: true
        }]
      }]
    },
    {
      id: 'q27',
      type: 'textarea',
      label: 'Что еще Вы хотели бы добавить о своем здоровье',
      placeholder: 'Дополнительная информация'
    },
    {
      id: 'q28',
      type: 'textarea',
      label: 'Какой самый важный вопрос вас волнует в первую очередь',
      placeholder: 'Опишите главную проблему или вопрос',
      required: true
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      placeholder: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      placeholder: 'username',
      required: false
    }
  ]
};

// Экспорт всех анкет
export const allQuestionnaires: Questionnaire[] = [
  babiesQuestionnaire,
  childrenQuestionnaire,
  femaleQuestionnaire,
  maleQuestionnaire
];

// Функция для получения анкеты по ID
export function getQuestionnaireById(id: string): Questionnaire | undefined {
  return allQuestionnaires.find(q => q.id === id);
}

