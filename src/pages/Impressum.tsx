import { Link } from 'react-router-dom';
import { getLanguage } from '../utils/i18n';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import './Impressum.css';

export const Impressum = () => {
  const lang = getLanguage();
  
  const content = {
    ru: {
      title: 'Политика конфиденциальности',
      owner: 'Владелец сайта',
      name: 'Надежда',
      profession: 'Wellness-консультант',
      contact: 'Контактная информация',
      dataProtection: 'Защита персональных данных',
      dataProtectionText: 'Мы обрабатываем ваши персональные данные в соответствии с GDPR и другими применимыми законами о защите данных. Данные используются исключительно для консультационных целей и не передаются третьим лицам. Все данные хранятся в зашифрованном виде и обрабатываются с соблюдением конфиденциальности.',
      dataCollection: 'Сбор данных',
      dataCollectionText: 'Мы собираем только те данные, которые вы добровольно предоставляете при заполнении анкет. Это включает информацию о здоровье, контактные данные и другую информацию, необходимую для предоставления консультационных услуг.',
      dataStorage: 'Хранение данных',
      dataStorageText: 'Ваши данные хранятся на защищенных серверах и обрабатываются в соответствии с требованиями безопасности. Мы принимаем все необходимые меры для защиты ваших данных от несанкционированного доступа.',
      rights: 'Ваши права',
      rightsText: 'Вы имеете право на доступ, исправление, удаление и ограничение обработки ваших персональных данных. Вы также можете отозвать свое согласие на обработку данных в любое время. Для осуществления этих прав свяжитесь с нами.',
      back: 'Вернуться на главную'
    },
    en: {
      title: 'Privacy Policy',
      owner: 'Website Owner',
      name: 'Nadezhda',
      profession: 'Wellness Consultant',
      contact: 'Contact Information',
      dataProtection: 'Data Protection',
      dataProtectionText: 'We process your personal data in accordance with GDPR and other applicable data protection laws. Data is used solely for consultation purposes and is not shared with third parties. All data is stored in encrypted form and processed with confidentiality.',
      dataCollection: 'Data Collection',
      dataCollectionText: 'We only collect data that you voluntarily provide when filling out questionnaires. This includes health information, contact details, and other information necessary to provide consultation services.',
      dataStorage: 'Data Storage',
      dataStorageText: 'Your data is stored on secure servers and processed in accordance with security requirements. We take all necessary measures to protect your data from unauthorized access.',
      rights: 'Your Rights',
      rightsText: 'You have the right to access, correct, delete, and restrict the processing of your personal data. You can also withdraw your consent to data processing at any time. To exercise these rights, please contact us.',
      back: 'Back to Home'
    }
  };
  
  const currentContent = content[lang];
  
  return (
    <div className="impressum-page">
      <header className="impressum-header">
        <Link to="/" className="logo-link">
          <img src="/logo.svg" alt="Wellness Logo" className="header-logo" />
        </Link>
        <div className="impressum-header-right">
          <Link to="/" className="back-link">← {currentContent.back}</Link>
          <LanguageSwitcher />
        </div>
      </header>
      
      <main className="impressum-content">
        <h1>{currentContent.title}</h1>
        
        <section className="impressum-section">
          <h2>{currentContent.owner}</h2>
          <p><strong>{currentContent.name}</strong></p>
          <p>{currentContent.profession}</p>
        </section>
        
        <section className="impressum-section">
          <h2>{currentContent.contact}</h2>
          <p>Для связи используйте форму обратной связи на главной странице.</p>
          <p>Contact us through the feedback form on the main page.</p>
        </section>
        
        <section className="impressum-section">
          <h2>{currentContent.dataProtection}</h2>
          <p>{currentContent.dataProtectionText}</p>
        </section>
        
        <section className="impressum-section">
          <h2>{currentContent.dataCollection}</h2>
          <p>{currentContent.dataCollectionText}</p>
        </section>
        
        <section className="impressum-section">
          <h2>{currentContent.dataStorage}</h2>
          <p>{currentContent.dataStorageText}</p>
        </section>
        
        <section className="impressum-section">
          <h2>{currentContent.rights}</h2>
          <p>{currentContent.rightsText}</p>
        </section>
        
        <div className="impressum-footer">
          <Link to="/" className="home-link">
            {currentContent.back}
          </Link>
        </div>
      </main>
    </div>
  );
};

