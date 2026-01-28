// Структура данных для всех анкет
// ВАЖНО: Используются строго указанные вопросы без изменений

export type FieldType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'file' | 'number' | 'group';

export interface FieldOption {
  value: string;
  label: string;
  labelEn?: string;
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
  labelEn?: string;
  placeholder?: string;
  placeholderEn?: string;
  required?: boolean;
  unit?: string; // Единица измерения (кг, см, лет и т.д.)
  min?: number; // Минимальное значение для number
  max?: number; // Максимальное значение для number
}

export interface QuestionField {
  id: string;
  type: FieldType;
  label: string;
  labelEn?: string;
  placeholder?: string;
  placeholderEn?: string;
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
  otherLabelEn?: string;
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
      labelEn: 'Basic information about the baby',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', labelEn: 'First name', required: true, placeholder: 'Имя ребёнка', placeholderEn: 'Baby\'s first name' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', labelEn: 'Last name', required: true, placeholder: 'Фамилия ребёнка', placeholderEn: 'Baby\'s last name' },
        { id: 'q1_age', type: 'number', label: 'Возраст', labelEn: 'Age', required: true, placeholder: 'Возраст в месяцах', placeholderEn: 'Age in months', unit: 'месяцев', min: 0, max: 12 },
        { id: 'q1_weight', type: 'number', label: 'Вес', labelEn: 'Weight', required: true, placeholder: 'Вес', placeholderEn: 'Weight', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q2',
      type: 'checkbox',
      label: 'Пищеварение — боли в животе, диарея, запор',
      labelEn: 'Digestion – tummy pain, diarrhea, constipation',
      options: [
        { value: 'stomach_pain', label: 'Боли в животе', labelEn: 'Tummy pain' },
        { value: 'diarrhea', label: 'Диарея', labelEn: 'Diarrhea' },
        { value: 'constipation', label: 'Запор', labelEn: 'Constipation' },
        { value: 'bloating', label: 'Вздутие', labelEn: 'Bloating' },
        { value: 'none', label: 'Не беспокоит', labelEn: 'No issues' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с пищеварением',
      otherLabelEn: 'Please describe other digestion issues'
    },
    {
      id: 'q3',
      type: 'radio',
      label: 'Потеет ли во сне',
      labelEn: 'Does the baby sweat during sleep',
      required: true,
      options: [
        { value: 'no', label: 'Нет', labelEn: 'No' },
        { value: 'sometimes', label: 'Иногда', labelEn: 'Sometimes' },
        { value: 'often', label: 'Часто', labelEn: 'Often' },
        { value: 'always', label: 'Постоянно', labelEn: 'Always' }
      ]
    },
    {
      id: 'q4',
      type: 'radio',
      label: 'Есть ли неприятный запах изо рта',
      labelEn: 'Is there an unpleasant smell from the mouth',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      label: 'Родинки, бородавки, высыпания, экземы',
      labelEn: 'Moles, warts, rashes, eczema',
      options: [
        { value: 'moles', label: 'Родинки', labelEn: 'Moles' },
        { value: 'warts', label: 'Бородавки', labelEn: 'Warts' },
        { value: 'rash', label: 'Высыпания', labelEn: 'Rashes' },
        { value: 'eczema', label: 'Экземы', labelEn: 'Eczema' },
        { value: 'none', label: 'Нет', labelEn: 'None' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие кожные проявления',
      otherLabelEn: 'Please describe other skin issues'
    },
    {
      id: 'q6',
      type: 'checkbox',
      label: 'Аллергия (цветение, животные, пыль, еда)',
      labelEn: 'Allergy (pollen, animals, dust, food)',
      options: [
        { value: 'pollen', label: 'Цветение', labelEn: 'Pollen' },
        { value: 'animals', label: 'Животные', labelEn: 'Animals' },
        { value: 'dust', label: 'Пыль', labelEn: 'Dust' },
        { value: 'food', label: 'Еда', labelEn: 'Food' },
        { value: 'none', label: 'Нет аллергии', labelEn: 'No allergy' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие виды аллергии',
      otherLabelEn: 'Please describe other allergies'
    },
    {
      id: 'q7',
      type: 'number',
      label: 'Сколько воды в день пьёт ребёнок',
      labelEn: 'How much water does the baby drink per day',
      placeholder: 'Количество воды',
      placeholderEn: 'Amount of water',
      unit: 'мл',
      min: 0
    },
    {
      id: 'q8',
      type: 'textarea',
      label: 'Травмы, операции, удары по голове, падения, переломы',
      labelEn: 'Injuries, surgeries, head hits, falls, fractures',
      placeholder: 'Опишите, если были',
      placeholderEn: 'Describe if any'
    },
    {
      id: 'q9',
      type: 'textarea',
      label: 'Как ребёнок спит',
      labelEn: 'How does the baby sleep',
      placeholder: 'Опишите режим и качество сна',
      placeholderEn: 'Describe sleep pattern and quality'
    },
    {
      id: 'q10',
      type: 'checkbox',
      label: 'Часто ли болеет, принимал ли антибиотики или лекарства',
      labelEn: 'Does the baby often get sick, has taken antibiotics or medicines',
      options: [
        { value: 'often_sick', label: 'Часто болеет', labelEn: 'Often gets sick' },
        { value: 'antibiotics', label: 'Принимал антибиотики', labelEn: 'Has taken antibiotics' },
        { value: 'medications', label: 'Принимал лекарства', labelEn: 'Has taken medicines' },
        { value: 'none', label: 'Не болеет, не принимал', labelEn: 'Does not get sick, has not taken' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите дополнительную информацию',
      otherLabelEn: 'Please provide additional information'
    },
    {
      id: 'q11',
      type: 'radio',
      label: 'Как прошли роды',
      labelEn: 'How was the delivery',
      required: true,
      options: [
        { value: 'natural', label: 'Естественные', labelEn: 'Natural' },
        { value: 'cesarean', label: 'Кесарево', labelEn: 'Cesarean section' }
      ]
    },
    {
      id: 'q12',
      type: 'radio',
      label: 'Был ли у мамы токсикоз',
      labelEn: 'Did the mother have toxicosis',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q13',
      type: 'radio',
      label: 'Была ли у мамы аллергия',
      labelEn: 'Did the mother have allergies',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q14',
      type: 'radio',
      label: 'Был ли у мамы запор',
      labelEn: 'Did the mother have constipation',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q15',
      type: 'radio',
      label: 'Принимала ли мама антибиотики',
      labelEn: 'Did the mother take antibiotics',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q16',
      type: 'radio',
      label: 'Была ли анемия',
      labelEn: 'Did the mother have anemia',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q17',
      type: 'textarea',
      label: 'Проблемы во время беременности',
      labelEn: 'Problems during pregnancy',
      placeholder: 'Опишите, если были',
      placeholderEn: 'Describe if any'
    },
    {
      id: 'q18',
      type: 'textarea',
      label: 'Что ещё важно знать о здоровье ребёнка',
      labelEn: 'What else is important to know about the baby’s health',
      placeholder: 'Дополнительная информация',
      placeholderEn: 'Additional information'
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      labelEn: 'Telegram for contact (enter @username)',
      placeholder: '@username',
      placeholderEn: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      labelEn: 'Instagram for contact (enter username without @)',
      placeholder: 'username',
      placeholderEn: 'username',
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
      labelEn: 'Basic information about the child',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', labelEn: 'First name', required: true, placeholder: 'Имя ребёнка', placeholderEn: 'Child\'s first name' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', labelEn: 'Last name', required: true, placeholder: 'Фамилия ребёнка', placeholderEn: 'Child\'s last name' },
        { id: 'q1_age', type: 'number', label: 'Возраст', labelEn: 'Age', required: true, placeholder: 'Возраст', placeholderEn: 'Age', unit: 'лет', min: 1, max: 12 },
        { id: 'q1_weight', type: 'number', label: 'Вес', labelEn: 'Weight', required: true, placeholder: 'Вес', placeholderEn: 'Weight', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q2',
      type: 'checkbox',
      label: 'Пищеварение — боли, диарея, запор',
      labelEn: 'Digestion – pain, diarrhea, constipation',
      options: [
        { value: 'stomach_pain', label: 'Боли в животе', labelEn: 'Tummy pain' },
        { value: 'diarrhea', label: 'Диарея', labelEn: 'Diarrhea' },
        { value: 'constipation', label: 'Запор', labelEn: 'Constipation' },
        { value: 'bloating', label: 'Вздутие', labelEn: 'Bloating' },
        { value: 'none', label: 'Не беспокоит', labelEn: 'No issues' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с пищеварением',
      otherLabelEn: 'Please describe other digestion issues'
    },
    {
      id: 'q3',
      type: 'radio',
      label: 'Зубы — быстро портятся',
      labelEn: 'Teeth – decay quickly',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q4',
      type: 'radio',
      label: 'Потеет во сне, скрипит зубами',
      labelEn: 'Sweats during sleep, grinds teeth',
      required: true,
      options: [
        { value: 'both', label: 'И то, и другое', labelEn: 'Both' },
        { value: 'sweats', label: 'Только потеет', labelEn: 'Only sweats' },
        { value: 'teeth', label: 'Только скрипит зубами', labelEn: 'Only grinds teeth' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q5',
      type: 'radio',
      label: 'Неприятный запах изо рта',
      labelEn: 'Unpleasant smell from the mouth',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q6',
      type: 'radio',
      label: 'Зависимость от сладкого и снеков',
      labelEn: 'Dependence on sweets and snacks',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' },
        { value: 'sometimes', label: 'Иногда', labelEn: 'Sometimes' }
      ]
    },
    {
      id: 'q7',
      type: 'checkbox',
      label: 'Родинки, бородавки, высыпания, экземы',
      labelEn: 'Moles, warts, rashes, eczema',
      options: [
        { value: 'moles', label: 'Родинки', labelEn: 'Moles' },
        { value: 'warts', label: 'Бородавки', labelEn: 'Warts' },
        { value: 'rash', label: 'Высыпания', labelEn: 'Rashes' },
        { value: 'eczema', label: 'Экземы', labelEn: 'Eczema' },
        { value: 'none', label: 'Нет', labelEn: 'None' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие кожные проявления',
      otherLabelEn: 'Please describe other skin issues'
    },
    {
      id: 'q8',
      type: 'checkbox',
      label: 'Аллергия',
      labelEn: 'Allergy',
      options: [
        { value: 'pollen', label: 'Цветение', labelEn: 'Pollen' },
        { value: 'animals', label: 'Животные', labelEn: 'Animals' },
        { value: 'dust', label: 'Пыль', labelEn: 'Dust' },
        { value: 'food', label: 'Еда', labelEn: 'Food' },
        { value: 'medications', label: 'Лекарства', labelEn: 'Medicines' },
        { value: 'none', label: 'Нет аллергии', labelEn: 'No allergy' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие виды аллергии',
      otherLabelEn: 'Please describe other allergies'
    },
    {
      id: 'q9',
      type: 'radio',
      label: 'Гиперактивность или усталость',
      labelEn: 'Hyperactivity or fatigue',
      required: true,
      options: [
        { value: 'hyperactive', label: 'Гиперактивность', labelEn: 'Hyperactivity' },
        { value: 'tired', label: 'Усталость', labelEn: 'Fatigue' },
        { value: 'both', label: 'И то, и другое', labelEn: 'Both' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q10',
      type: 'number',
      label: 'Сколько воды пьёт в день',
      labelEn: 'How much water does the child drink per day',
      placeholder: 'Количество воды',
      placeholderEn: 'Amount of water',
      unit: 'мл',
      min: 0
    },
    {
      id: 'q11',
      type: 'textarea',
      label: 'Травмы, операции, падения',
      labelEn: 'Injuries, surgeries, falls',
      placeholder: 'Опишите, если были',
      placeholderEn: 'Describe if any'
    },
    {
      id: 'q12',
      type: 'textarea',
      label: 'Головные боли, плохой сон',
      labelEn: 'Headaches, poor sleep',
      placeholder: 'Опишите частоту и характер',
      placeholderEn: 'Describe frequency and nature'
    },
    {
      id: 'q13',
      type: 'checkbox',
      label: 'Часто ли болеет, антибиотики',
      labelEn: 'Does the child often get sick, antibiotics',
      options: [
        { value: 'often_sick', label: 'Часто болеет', labelEn: 'Often gets sick' },
        { value: 'antibiotics', label: 'Принимал антибиотики', labelEn: 'Has taken antibiotics' },
        { value: 'none', label: 'Не болеет, не принимал', labelEn: 'Does not get sick, has not taken' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите дополнительную информацию',
      otherLabelEn: 'Please provide additional information'
    },
    {
      id: 'q14',
      type: 'textarea',
      label: 'Что ещё важно знать о здоровье ребёнка',
      labelEn: 'What else is important to know about the child’s health',
      placeholder: 'Дополнительная информация',
      placeholderEn: 'Additional information'
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      labelEn: 'Telegram for contact (enter @username)',
      placeholder: '@username',
      placeholderEn: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      labelEn: 'Instagram for contact (enter username without @)',
      placeholder: 'username',
      placeholderEn: 'username',
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
      labelEn: 'Basic information',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', labelEn: 'First name', required: true, placeholder: 'Имя', placeholderEn: 'First name' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', labelEn: 'Last name', required: true, placeholder: 'Фамилия', placeholderEn: 'Last name' },
        { id: 'q1_age', type: 'number', label: 'Возраст', labelEn: 'Age', required: true, placeholder: 'Возраст', placeholderEn: 'Age', unit: 'лет', min: 0 },
        { id: 'q1_weight', type: 'number', label: 'Вес', labelEn: 'Weight', required: true, placeholder: 'Вес', placeholderEn: 'Weight', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q1_height',
      type: 'number',
      label: 'Рост',
      labelEn: 'Height',
      required: true,
      placeholder: 'Рост',
      placeholderEn: 'Height',
      unit: 'см',
      min: 0
    },
    {
      id: 'q1_weight_goal',
      type: 'text',
      label: 'Если недовольны своим весом – сколько хотите убрать или добавить',
      labelEn: 'If you are not satisfied with your weight – how many kg do you want to lose or gain',
      placeholder: 'Например: хочу убрать 5 кг или добавить 3 кг',
      placeholderEn: 'For example: I want to lose 5 kg or gain 3 kg'
    },
    {
      id: 'q2',
      type: 'number',
      label: 'Сколько воды в день Вы пьете? (не чай, не кофе, не другие напитки, а только вода)',
      labelEn: 'How much water do you drink per day? (only pure water, not tea, coffee or other drinks)',
      required: true,
      placeholder: 'Количество воды',
      placeholderEn: 'Amount of water',
      unit: 'литров',
      min: 0
    },
    {
      id: 'q3',
      type: 'textarea',
      label: 'Был ли ковид (сколько раз) или вакцина от ковид (сколько доз)',
      labelEn: 'Have you had COVID (how many times) or a COVID vaccine (how many doses)',
      placeholder: 'Опишите подробно. Были ли осложнения после ковид: выпадение волос, проблемы сердца, суставы, потеря памяти, панические атаки, ухудшение сна и т.д.',
      placeholderEn: 'Describe in detail. Any complications after COVID: hair loss, heart problems, joints, memory loss, panic attacks, worse sleep, etc.'
    },
    {
      id: 'q4',
      type: 'checkbox',
      label: 'Волосы',
      labelEn: 'Hair',
      options: [
        { value: 'satisfied', label: 'Довольны качеством', labelEn: 'Satisfied with quality' },
        { value: 'hair_loss', label: 'Агрессивно выпадают', labelEn: 'Severely falling out' },
        { value: 'dry', label: 'Сухие', labelEn: 'Dry' },
        { value: 'oily', label: 'Жирные', labelEn: 'Oily' },
        { value: 'brittle', label: 'Ломкие', labelEn: 'Brittle' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      label: 'Зубы',
      labelEn: 'Teeth',
      options: [
        { value: 'crumbling', label: 'Быстро крошатся или портятся', labelEn: 'Crumbly or decaying quickly' },
        { value: 'bad_breath', label: 'Неприятный запах изо рта', labelEn: 'Bad breath' },
        { value: 'bleeding_gums', label: 'Кровоточат десны', labelEn: 'Bleeding gums' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q6',
      type: 'checkbox',
      label: 'Пищеварение',
      labelEn: 'Digestion',
      options: [
        { value: 'heartburn', label: 'Изжога', labelEn: 'Heartburn' },
        { value: 'bitterness', label: 'Горечь во рту', labelEn: 'Bitterness in the mouth' },
        { value: 'bloating', label: 'Вздутие', labelEn: 'Bloating' },
        { value: 'heaviness', label: 'Тяжесть в желудке', labelEn: 'Heaviness in the stomach' },
        { value: 'gas', label: 'Газы', labelEn: 'Gas' },
        { value: 'diarrhea', label: 'Диарея', labelEn: 'Diarrhea' },
        { value: 'constipation', label: 'Запор', labelEn: 'Constipation' },
        { value: 'pancreatitis', label: 'Панкреатит', labelEn: 'Pancreatitis' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q7',
      type: 'textarea',
      label: 'Песок или камни в желчном или почках. Если есть камни, указать размер',
      labelEn: 'Sand or stones in gallbladder or kidneys. If there are stones, indicate the size',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present, indicate size'
    },
    {
      id: 'q8',
      type: 'textarea',
      label: 'Были ли операции (какие именно), все ли органы на месте (какой орган удален), травмы',
      labelEn: 'Have you had surgeries (which ones), are all organs in place (which organ removed), injuries',
      placeholder: 'Опишите подробно',
      placeholderEn: 'Describe in detail'
    },
    {
      id: 'q9',
      type: 'select',
      label: 'Давление',
      labelEn: 'Blood pressure',
      options: [
        { value: 'high', label: 'Высокое', labelEn: 'High' },
        { value: 'low', label: 'Низкое', labelEn: 'Low' },
        { value: 'normal', label: 'Нормальное', labelEn: 'Normal' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q9', value: 'high' },
        fields: [{
          id: 'q9_meds',
          type: 'radio',
          label: 'Пьете ли лекарства от давления',
          labelEn: 'Do you take blood pressure medication',
          required: true,
          options: [
            { value: 'yes', label: 'Да', labelEn: 'Yes' },
            { value: 'no', label: 'Нет', labelEn: 'No' }
          ]
        }, {
          id: 'q9_meds_duration',
          type: 'text',
          label: 'Как долго принимаете лекарства',
          labelEn: 'How long have you been taking the medication',
          placeholder: 'Например: 2 года',
          placeholderEn: 'For example: 2 years',
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
      labelEn: 'Do you have chronic or autoimmune diseases',
      options: [
        { value: 'diabetes', label: 'Диабет', labelEn: 'Diabetes' },
        { value: 'thyroiditis', label: 'Аутоиммунный тиреоидит', labelEn: 'Autoimmune thyroiditis' },
        { value: 'arthritis', label: 'Артрит', labelEn: 'Arthritis' },
        { value: 'psoriasis', label: 'Псориаз', labelEn: 'Psoriasis' },
        { value: 'none', label: 'Нет', labelEn: 'None' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие заболевания',
      otherLabelEn: 'Please list other diseases'
    },
    {
      id: 'q11',
      type: 'checkbox',
      label: 'Головные боли, мигрени, метеозависимость, сотрясение мозга, удары по голове, шум в ушах, мушки перед глазами, головокружения',
      labelEn: 'Headaches, migraines, weather sensitivity, concussion, head injuries, tinnitus, floaters, dizziness',
      options: [
        { value: 'headaches', label: 'Головные боли', labelEn: 'Headaches' },
        { value: 'migraines', label: 'Мигрени', labelEn: 'Migraines' },
        { value: 'weather', label: 'Метеозависимость', labelEn: 'Weather sensitivity' },
        { value: 'concussion', label: 'Сотрясение мозга', labelEn: 'Concussion' },
        { value: 'head_injury', label: 'Удары по голове', labelEn: 'Head injuries' },
        { value: 'tinnitus', label: 'Шум в ушах', labelEn: 'Tinnitus' },
        { value: 'floaters', label: 'Мушки перед глазами', labelEn: 'Floaters in vision' },
        { value: 'dizziness', label: 'Головокружения', labelEn: 'Dizziness' },
        { value: 'none', label: 'Нет', labelEn: 'None' }
      ]
    },
    {
      id: 'q12',
      type: 'radio',
      label: 'Онемение пальцев рук и ног, руки-ноги холодные даже летом',
      labelEn: 'Numbness of fingers and toes, hands and feet cold even in summer',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ]
    },
    {
      id: 'q13',
      type: 'textarea',
      label: 'Варикоз (сеточка или выраженные вены), геморрой (кровоточит или нет), пигментные пятна',
      labelEn: 'Varicose veins (spider veins or pronounced veins), hemorrhoids (bleeding or not), pigment spots',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q14',
      type: 'checkbox',
      label: 'Суставы',
      labelEn: 'Joints',
      options: [
        { value: 'creaking', label: 'Скрипят', labelEn: 'Creaking' },
        { value: 'crunching', label: 'Хрустят', labelEn: 'Cracking' },
        { value: 'inflammation', label: 'Воспаляются', labelEn: 'Inflamed' },
        { value: 'arthrosis', label: 'Артроз', labelEn: 'Arthrosis' },
        { value: 'back_pain', label: 'Боли в спине', labelEn: 'Back pain' },
        { value: 'lower_back_pain', label: 'Боли в пояснице', labelEn: 'Lower back pain' },
        { value: 'knee_pain', label: 'Боли в коленях', labelEn: 'Knee pain' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с суставами',
      otherLabelEn: 'Please describe other joint issues'
    },
    {
      id: 'q15',
      type: 'textarea',
      label: 'Кисты, полипы, миомы, опухоли, грыжи',
      labelEn: 'Cysts, polyps, fibroids, tumors, hernias',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q16',
      type: 'textarea',
      label: 'Герпес, папилломы, родинки, бородавки, красные точечки на коже, выделения, цистит',
      labelEn: 'Herpes, papillomas, moles, warts, red dots on the skin, discharges, cystitis',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q17',
      type: 'checkbox',
      label: 'Женские дни',
      labelEn: 'Periods / women’s cycle',
      options: [
        { value: 'irregular', label: 'Нерегулярные', labelEn: 'Irregular' },
        { value: 'painful', label: 'Болезненные', labelEn: 'Painful' },
        { value: 'prolonged', label: 'Затяжные', labelEn: 'Prolonged' },
        { value: 'heavy_bleeding', label: 'Обильные кровотечения', labelEn: 'Heavy bleeding' },
        { value: 'menopause', label: 'Менопауза', labelEn: 'Menopause' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите дополнительную информацию',
      otherLabelEn: 'Please provide additional information'
    },
    {
      id: 'q18',
      type: 'textarea',
      label: 'Прыщи, фурункулы, акне, раздражение, розацеа, псориаз, дерматит, экзема',
      labelEn: 'Acne, boils, irritation, rosacea, psoriasis, dermatitis, eczema',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q19',
      type: 'checkbox',
      label: 'Аллергия (на пыльцу, еду, шерсть животных, пыль, лекарства)',
      labelEn: 'Allergy (to pollen, food, animal fur, dust, medicines)',
      options: [
        { value: 'pollen', label: 'Пыльца', labelEn: 'Pollen' },
        { value: 'food', label: 'Еда', labelEn: 'Food' },
        { value: 'animals', label: 'Шерсть животных', labelEn: 'Animal fur' },
        { value: 'dust', label: 'Пыль', labelEn: 'Dust' },
        { value: 'medications', label: 'Лекарства', labelEn: 'Medicines' },
        { value: 'none', label: 'Нет аллергии', labelEn: 'No allergy' }
      ]
    },
    {
      id: 'q20',
      type: 'textarea',
      label: 'Простуды',
      labelEn: 'Colds',
      placeholder: 'Сколько раз за год простужаетесь. Пользуетесь ли антибиотиками и жаропонижающими',
      placeholderEn: 'How many times per year do you catch a cold. Do you use antibiotics and fever reducers'
    },
    {
      id: 'q21',
      type: 'checkbox',
      label: 'Сон',
      labelEn: 'Sleep',
      options: [
        { value: 'hard_to_sleep', label: 'Трудно заснуть', labelEn: 'Hard to fall asleep' },
        { value: 'wake_up_often', label: 'Часто просыпаетесь ночью', labelEn: 'Wake up often at night' },
        { value: 'both', label: 'И то, и другое', labelEn: 'Both' },
        { value: 'no', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q22',
      type: 'checkbox',
      label: 'Энергия',
      labelEn: 'Energy',
      options: [
        { value: 'hard_morning', label: 'С утра нужно собрать себя по кусочкам', labelEn: 'In the morning you feel broken into pieces' },
        { value: 'very_hard_wake', label: 'Очень тяжело просыпаться', labelEn: 'Very hard to wake up' },
        { value: 'tired_morning', label: 'Утром чувствуете себя неотдохнувшим', labelEn: 'Feel not rested in the morning' },
        { value: 'need_coffee', label: 'Нужно стимулировать себя кофе', labelEn: 'Need coffee to stimulate yourself' },
        { value: 'all', label: 'Все перечисленное', labelEn: 'All of the above' },
        { value: 'no', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q23',
      type: 'checkbox',
      label: 'Память',
      labelEn: 'Memory',
      options: [
        { value: 'slow', label: 'Притормаживает', labelEn: 'Slows down' },
        { value: 'concentration', label: 'Трудно сконцентрироваться на каком-то деле', labelEn: 'Hard to concentrate on tasks' },
        { value: 'remember_names', label: 'Трудно вспомнить имена и события', labelEn: 'Hard to remember names and events' },
        { value: 'remember_info', label: 'Трудно запомнить информацию', labelEn: 'Hard to remember information' },
        { value: 'all', label: 'Все перечисленное', labelEn: 'All of the above' },
        { value: 'no', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q24',
      type: 'checkbox',
      label: 'Какой у вас образ жизни',
      labelEn: 'What is your lifestyle like',
      options: [
        { value: 'sedentary', label: 'Сидячий', labelEn: 'Sedentary' },
        { value: 'regular_sport', label: 'Занимаетесь регулярно спортом', labelEn: 'Regular sports' },
        { value: 'home_gym', label: 'Делаете дома гимнастику', labelEn: 'Do exercises at home' },
        { value: 'cold_water', label: 'Обливаетесь холодной водой', labelEn: 'Pour cold water / cold showers' },
        { value: 'stressful', label: 'Работаете в стрессовых условиях', labelEn: 'Work in stressful conditions' },
        { value: 'physical_work', label: 'Работа связана с физическими нагрузками', labelEn: 'Work involves physical activity' },
        { value: 'toxic_substances', label: 'Вдыхаете на работе токсичные вещества (парикмахер, мастер маникюра/педикюра, строитель, регулярно дышите краской (маляр, автомаляр) и др.)', labelEn: 'Inhale toxic substances at work (hairdresser, nail master, builder, painter, etc.)' }
      ]
    },
    {
      id: 'q25',
      type: 'radio',
      label: 'Принимаете ли лекарства на постоянной основе (если да - напишите название, если это возможно)',
      labelEn: 'Do you take any medicines on a regular basis (if yes, write the names if possible)',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q25', value: 'yes' },
        fields: [{
          id: 'q25_meds',
          type: 'textarea',
          label: 'Название лекарств',
          labelEn: 'Names of medicines',
          placeholder: 'Перечислите названия лекарств, которые принимаете постоянно',
          placeholderEn: 'List the names of medicines you take regularly',
          required: true
        }]
      }]
    },
    {
      id: 'q26',
      type: 'radio',
      label: 'Есть ли у вас анализы крови за последние 2-3 месяца? УЗИ?',
      labelEn: 'Do you have blood tests from the last 2-3 months? Ultrasound (USG)?',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q26', value: 'yes' },
        fields: [{
          id: 'q26_files',
          type: 'file',
          label: 'Загрузите анализы (любые форматы)',
          labelEn: 'Upload tests (any file formats)',
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
      labelEn: 'What else would you like to add about your health',
      placeholder: 'Дополнительная информация',
      placeholderEn: 'Additional information'
    },
    {
      id: 'q28',
      type: 'textarea',
      label: 'Какой самый важный вопрос вас волнует в первую очередь',
      labelEn: 'What is the most important issue or question that worries you first of all',
      placeholder: 'Опишите главную проблему или вопрос',
      placeholderEn: 'Describe the main problem or question',
      required: true
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      labelEn: 'Telegram for contact (enter @username)',
      placeholder: '@username',
      placeholderEn: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      labelEn: 'Instagram for contact (enter username without @)',
      placeholder: 'username',
      placeholderEn: 'username',
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
      labelEn: 'Basic information',
      required: true,
      groupedFields: [
        { id: 'q1_name', type: 'text', label: 'Имя', labelEn: 'First name', required: true, placeholder: 'Имя', placeholderEn: 'First name' },
        { id: 'q1_surname', type: 'text', label: 'Фамилия', labelEn: 'Last name', required: true, placeholder: 'Фамилия', placeholderEn: 'Last name' },
        { id: 'q1_age', type: 'number', label: 'Возраст', labelEn: 'Age', required: true, placeholder: 'Возраст', placeholderEn: 'Age', unit: 'лет', min: 0 },
        { id: 'q1_weight', type: 'number', label: 'Вес', labelEn: 'Weight', required: true, placeholder: 'Вес', placeholderEn: 'Weight', unit: 'кг', min: 0 }
      ]
    },
    {
      id: 'q1_height',
      type: 'number',
      label: 'Рост',
      labelEn: 'Height',
      required: true,
      placeholder: 'Рост',
      placeholderEn: 'Height',
      unit: 'см',
      min: 0
    },
    {
      id: 'q1_weight_goal',
      type: 'text',
      label: 'Если недовольны своим весом – сколько хотите убрать или добавить',
      labelEn: 'If you are not satisfied with your weight – how many kg do you want to lose or gain',
      placeholder: 'Например: хочу убрать 10 кг или добавить 5 кг',
      placeholderEn: 'For example: I want to lose 10 kg or gain 5 kg'
    },
    {
      id: 'q2',
      type: 'number',
      label: 'Сколько воды в день Вы пьете? (не чай, не кофе, не другие напитки, а только вода)',
      labelEn: 'How much water do you drink per day? (only pure water, not tea, coffee or other drinks)',
      required: true,
      placeholder: 'Количество воды',
      placeholderEn: 'Amount of water',
      unit: 'литров',
      min: 0
    },
    {
      id: 'q3',
      type: 'textarea',
      label: 'Был ли ковид (сколько раз) или вакцина от ковид (сколько доз)',
      labelEn: 'Have you had COVID (how many times) or a COVID vaccine (how many doses)',
      placeholder: 'Опишите подробно. Были ли осложнения после ковид: выпадение волос, проблемы сердца, суставы, потеря памяти, панические атаки, ухудшение сна и т.д.',
      placeholderEn: 'Describe in detail. Any complications after COVID: hair loss, heart problems, joints, memory loss, panic attacks, worse sleep, etc.'
    },
    {
      id: 'q4',
      type: 'checkbox',
      label: 'Волосы',
      labelEn: 'Hair',
      options: [
        { value: 'satisfied', label: 'Довольны качеством', labelEn: 'Satisfied with quality' },
        { value: 'hair_loss', label: 'Агрессивно выпадают', labelEn: 'Severely falling out' },
        { value: 'dry', label: 'Сухие', labelEn: 'Dry' },
        { value: 'oily', label: 'Жирные', labelEn: 'Oily' },
        { value: 'brittle', label: 'Ломкие', labelEn: 'Brittle' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      label: 'Зубы',
      labelEn: 'Teeth',
      options: [
        { value: 'crumbling', label: 'Быстро крошатся или портятся', labelEn: 'Crumbly or decaying quickly' },
        { value: 'bad_breath', label: 'Неприятный запах изо рта', labelEn: 'Bad breath' },
        { value: 'bleeding_gums', label: 'Кровоточат десны', labelEn: 'Bleeding gums' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' }
      ]
    },
    {
      id: 'q6',
      type: 'checkbox',
      label: 'Пищеварение',
      labelEn: 'Digestion',
      options: [
        { value: 'heartburn', label: 'Изжога', labelEn: 'Heartburn' },
        { value: 'bitterness', label: 'Горечь во рту', labelEn: 'Bitterness in the mouth' },
        { value: 'bloating', label: 'Вздутие', labelEn: 'Bloating' },
        { value: 'heaviness', label: 'Тяжесть в желудке', labelEn: 'Heaviness in the stomach' },
        { value: 'gas', label: 'Газы', labelEn: 'Gas' },
        { value: 'diarrhea', label: 'Диарея', labelEn: 'Diarrhea' },
        { value: 'constipation', label: 'Запор', labelEn: 'Constipation' },
        { value: 'pancreatitis', label: 'Панкреатит', labelEn: 'Pancreatitis' },
        { value: 'none', label: 'Не беспокоит', labelEn: 'No issues' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с пищеварением',
      otherLabelEn: 'Please describe other digestion issues'
    },
    {
      id: 'q7',
      type: 'textarea',
      label: 'Песок или камни в желчном или почках. Если есть камни, указать размер',
      labelEn: 'Sand or stones in gallbladder or kidneys. If there are stones, indicate the size',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present, indicate size'
    },
    {
      id: 'q8',
      type: 'textarea',
      label: 'Были ли операции (какие именно), все ли органы на месте (какой орган удален), травмы',
      labelEn: 'Have you had surgeries (which ones), are all organs in place (which organ removed), injuries',
      placeholder: 'Опишите подробно',
      placeholderEn: 'Describe in detail'
    },
    {
      id: 'q9',
      type: 'select',
      label: 'Давление',
      labelEn: 'Blood pressure',
      options: [
        { value: 'high', label: 'Высокое', labelEn: 'High' },
        { value: 'low', label: 'Низкое', labelEn: 'Low' },
        { value: 'normal', label: 'Нормальное', labelEn: 'Normal' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q9', value: 'high' },
        fields: [{
          id: 'q9_meds',
          type: 'radio',
          label: 'Пьете ли лекарства от давления',
          labelEn: 'Do you take blood pressure medication',
          required: true,
          options: [
            { value: 'yes', label: 'Да', labelEn: 'Yes' },
            { value: 'no', label: 'Нет', labelEn: 'No' }
          ]
        }, {
          id: 'q9_meds_duration',
          type: 'text',
          label: 'Как долго принимаете лекарства',
          labelEn: 'How long have you been taking the medication',
          placeholder: 'Например: 3 года',
          placeholderEn: 'For example: 3 years',
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
      labelEn: 'Do you have chronic or autoimmune diseases',
      options: [
        { value: 'diabetes', label: 'Диабет', labelEn: 'Diabetes' },
        { value: 'thyroiditis', label: 'Аутоиммунный тиреоидит', labelEn: 'Autoimmune thyroiditis' },
        { value: 'arthritis', label: 'Артрит', labelEn: 'Arthritis' },
        { value: 'psoriasis', label: 'Псориаз', labelEn: 'Psoriasis' },
        { value: 'none', label: 'Нет', labelEn: 'None' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие заболевания',
      otherLabelEn: 'Please list other diseases'
    },
    {
      id: 'q11',
      type: 'checkbox',
      label: 'Головные боли, мигрени, метеозависимость, сотрясение мозга, удары по голове, шум в ушах, мушки перед глазами, головокружения',
      labelEn: 'Headaches, migraines, weather sensitivity, concussion, head injuries, tinnitus, floaters, dizziness',
      options: [
        { value: 'headaches', label: 'Головные боли', labelEn: 'Headaches' },
        { value: 'migraines', label: 'Мигрени', labelEn: 'Migraines' },
        { value: 'weather', label: 'Метеозависимость', labelEn: 'Weather sensitivity' },
        { value: 'concussion', label: 'Сотрясение мозга', labelEn: 'Concussion' },
        { value: 'head_injury', label: 'Удары по голове', labelEn: 'Head injuries' },
        { value: 'tinnitus', label: 'Шум в ушах', labelEn: 'Tinnitus' },
        { value: 'floaters', label: 'Мушки перед глазами', labelEn: 'Floaters in vision' },
        { value: 'dizziness', label: 'Головокружения', labelEn: 'Dizziness' },
        { value: 'none', label: 'Не беспокоит', labelEn: 'Does not bother' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы',
      otherLabelEn: 'Please describe other problems'
    },
    {
      id: 'q12',
      type: 'radio',
      label: 'Онемение пальцев рук и ног, руки-ноги холодные даже летом',
      labelEn: 'Numbness of fingers and toes, hands and feet cold even in summer',
      required: true,
      options: [
        { value: 'no', label: 'Нет', labelEn: 'No' },
        { value: 'sometimes', label: 'Иногда', labelEn: 'Sometimes' },
        { value: 'often', label: 'Часто', labelEn: 'Often' },
        { value: 'always', label: 'Постоянно', labelEn: 'Always' }
      ]
    },
    {
      id: 'q13',
      type: 'textarea',
      label: 'Варикоз (сеточка или выраженные вены), геморрой (кровоточит или нет), пигментные пятна',
      labelEn: 'Varicose veins (spider veins or pronounced veins), hemorrhoids (bleeding or not), pigment spots',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q14',
      type: 'checkbox',
      label: 'Суставы',
      labelEn: 'Joints',
      options: [
        { value: 'creaking', label: 'Скрипят', labelEn: 'Creaking' },
        { value: 'crunching', label: 'Хрустят', labelEn: 'Cracking' },
        { value: 'inflammation', label: 'Воспаляются', labelEn: 'Inflamed' },
        { value: 'arthrosis', label: 'Артроз', labelEn: 'Arthrosis' },
        { value: 'back_pain', label: 'Боли в спине', labelEn: 'Back pain' },
        { value: 'lower_back_pain', label: 'Боли в пояснице', labelEn: 'Lower back pain' },
        { value: 'knee_pain', label: 'Боли в коленях', labelEn: 'Knee pain' },
        { value: 'none', label: 'Нет проблем', labelEn: 'No problems' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с суставами',
      otherLabelEn: 'Please describe other joint issues'
    },
    {
      id: 'q15',
      type: 'textarea',
      label: 'Кисты, полипы, миомы, опухоли, грыжи',
      labelEn: 'Cysts, polyps, tumors, hernias',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q16',
      type: 'textarea',
      label: 'Герпес, папилломы, родинки, бородавки, красные точечки на коже, выделения, цистит',
      labelEn: 'Herpes, papillomas, moles, warts, red dots on skin, discharges, cystitis',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q17',
      type: 'textarea',
      label: 'Простатит',
      labelEn: 'Prostatitis',
      placeholder: 'Опишите, если есть проблемы',
      placeholderEn: 'Describe if you have problems'
    },
    {
      id: 'q18',
      type: 'textarea',
      label: 'Прыщи, фурункулы, акне, раздражение, розацеа, псориаз, дерматит, экзема',
      labelEn: 'Acne, boils, irritation, rosacea, psoriasis, dermatitis, eczema',
      placeholder: 'Опишите, если есть',
      placeholderEn: 'Describe if present'
    },
    {
      id: 'q19',
      type: 'checkbox',
      label: 'Аллергия (на пыльцу, еду, шерсть животных, пыль, лекарства)',
      labelEn: 'Allergy (to pollen, food, animal fur, dust, medicines)',
      options: [
        { value: 'pollen', label: 'Пыльца', labelEn: 'Pollen' },
        { value: 'food', label: 'Еда', labelEn: 'Food' },
        { value: 'animals', label: 'Шерсть животных', labelEn: 'Animal fur' },
        { value: 'dust', label: 'Пыль', labelEn: 'Dust' },
        { value: 'medications', label: 'Лекарства', labelEn: 'Medicines' },
        { value: 'none', label: 'Нет аллергии', labelEn: 'No allergy' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие виды аллергии',
      otherLabelEn: 'Please describe other allergies'
    },
    {
      id: 'q20',
      type: 'textarea',
      label: 'Простуды',
      labelEn: 'Colds',
      placeholder: 'Сколько раз за год простужаетесь. Пользуетесь ли антибиотиками и жаропонижающими',
      placeholderEn: 'How many times per year do you catch a cold. Do you use antibiotics and fever reducers'
    },
    {
      id: 'q21',
      type: 'checkbox',
      label: 'Сон',
      labelEn: 'Sleep',
      options: [
        { value: 'hard_to_sleep', label: 'Трудно заснуть', labelEn: 'Hard to fall asleep' },
        { value: 'wake_up_often', label: 'Часто просыпаетесь ночью', labelEn: 'Wake up often at night' },
        { value: 'both', label: 'И то, и другое', labelEn: 'Both' },
        { value: 'no', label: 'Не беспокоит', labelEn: 'No issues' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы со сном',
      otherLabelEn: 'Please describe other sleep issues'
    },
    {
      id: 'q22',
      type: 'checkbox',
      label: 'Энергия',
      labelEn: 'Energy',
      options: [
        { value: 'hard_morning', label: 'С утра нужно собрать себя по кусочкам', labelEn: 'In the morning you feel broken into pieces' },
        { value: 'very_hard_wake', label: 'Очень тяжело просыпаться', labelEn: 'Very hard to wake up' },
        { value: 'tired_morning', label: 'Утром чувствуете себя неотдохнувшим', labelEn: 'Feel not rested in the morning' },
        { value: 'need_coffee', label: 'Нужно стимулировать себя кофе', labelEn: 'Need coffee to stimulate yourself' },
        { value: 'all', label: 'Все перечисленное', labelEn: 'All of the above' },
        { value: 'no', label: 'Не беспокоит', labelEn: 'No issues' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с энергией',
      otherLabelEn: 'Please describe other energy issues'
    },
    {
      id: 'q23',
      type: 'checkbox',
      label: 'Память',
      labelEn: 'Memory',
      options: [
        { value: 'slow', label: 'Притормаживает', labelEn: 'Slows down' },
        { value: 'concentration', label: 'Трудно сконцентрироваться на каком-то деле', labelEn: 'Hard to concentrate on tasks' },
        { value: 'remember_names', label: 'Трудно вспомнить имена и события', labelEn: 'Hard to remember names and events' },
        { value: 'remember_info', label: 'Трудно запомнить информацию', labelEn: 'Hard to remember information' },
        { value: 'all', label: 'Все перечисленное', labelEn: 'All of the above' },
        { value: 'no', label: 'Не беспокоит', labelEn: 'Does not bother' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие проблемы с памятью',
      otherLabelEn: 'Please describe other memory issues'
    },
    {
      id: 'q24',
      type: 'checkbox',
      label: 'Какой у вас образ жизни',
      labelEn: 'What is your lifestyle like',
      options: [
        { value: 'sedentary', label: 'Сидячий', labelEn: 'Sedentary' },
        { value: 'regular_sport', label: 'Регулярно занимаетесь спортом', labelEn: 'Regular sports' },
        { value: 'home_gym', label: 'Делаете дома гимнастику', labelEn: 'Do exercises at home' },
        { value: 'cold_water', label: 'Обливаетесь холодной водой', labelEn: 'Pour cold water / cold showers' },
        { value: 'stressful', label: 'Работаете в стрессовых условиях', labelEn: 'Work in stressful conditions' },
        { value: 'physical_work', label: 'Работа связана с физическими нагрузками', labelEn: 'Work involves physical activity' },
        { value: 'toxic_substances', label: 'Вдыхаете токсичные вещества на работе', labelEn: 'Inhale toxic substances at work' },
        { value: 'other', label: 'Другое', labelEn: 'Other', hasOther: true }
      ],
      allowOther: true,
      otherLabel: 'Укажите другие особенности образа жизни',
      otherLabelEn: 'Please describe other lifestyle features'
    },
    {
      id: 'q25',
      type: 'radio',
      label: 'Принимаете ли лекарства на постоянной основе (если да - напишите название, если это возможно)',
      labelEn: 'Do you take any medicines on a regular basis (if yes, write the names if possible)',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q25', value: 'yes' },
        fields: [{
          id: 'q25_meds',
          type: 'textarea',
          label: 'Название лекарств',
          labelEn: 'Names of medicines',
          placeholder: 'Перечислите названия лекарств, которые принимаете постоянно',
          placeholderEn: 'List the names of medicines you take regularly',
          required: true
        }]
      }]
    },
    {
      id: 'q26',
      type: 'radio',
      label: 'Есть ли у вас анализы крови за последние 2-3 месяца? УЗИ?',
      labelEn: 'Do you have blood tests from the last 2-3 months? Ultrasound (USG)?',
      required: true,
      options: [
        { value: 'yes', label: 'Да', labelEn: 'Yes' },
        { value: 'no', label: 'Нет', labelEn: 'No' }
      ],
      conditionalFields: [{
        condition: { fieldId: 'q26', value: 'yes' },
        fields: [{
          id: 'q26_files',
          type: 'file',
          label: 'Загрузите анализы (любые форматы)',
          labelEn: 'Upload tests (any file formats)',
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
      labelEn: 'What else would you like to add about your health',
      placeholder: 'Дополнительная информация',
      placeholderEn: 'Additional information'
    },
    {
      id: 'q28',
      type: 'textarea',
      label: 'Какой самый важный вопрос вас волнует в первую очередь',
      labelEn: 'What is the most important issue or question that worries you first of all',
      placeholder: 'Опишите главную проблему или вопрос',
      placeholderEn: 'Describe the main problem or question',
      required: true
    },
    {
      id: 'contact_telegram',
      type: 'text',
      label: 'Telegram для связи (укажите @username)',
      labelEn: 'Telegram for contact (enter @username)',
      placeholder: '@username',
      placeholderEn: '@username',
      required: true
    },
    {
      id: 'contact_instagram',
      type: 'text',
      label: 'Instagram для связи (укажите username без @)',
      labelEn: 'Instagram for contact (enter username without @)',
      placeholder: 'username',
      placeholderEn: 'username',
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

