import React from 'react';
import { getLanguage, setLanguage, type Language } from '../utils/i18n';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const currentLang = getLanguage();
  
  const handleChange = (lang: Language) => {
    setLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    // Перезагружаем страницу для применения изменений
    window.location.reload();
  };
  
  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLang === 'ru' ? 'active' : ''}`}
        onClick={() => handleChange('ru')}
      >
        RU
      </button>
      <button
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => handleChange('en')}
      >
        EN
      </button>
    </div>
  );
};

