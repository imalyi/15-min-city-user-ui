import React, { useState } from 'react';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';
import { logger } from '../logger';
import { Icon } from '@iconify/react';

function Footer({ useMargin })  {
  const footerClass = useMargin ? 'margin-footer' : '';
  const { i18n, t } = useTranslation();
  const [isTranslateChangeVisible, setTranslateChangeVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  logger.log(selectedLanguage);
  const translateTranscript = {
    'pl': 'Polski',
    'en': 'English',
    'de': 'Deutsch',
  };
  const language = translateTranscript[selectedLanguage];
  const handleToggleTranslateChange = () => {
    setTranslateChangeVisible((prev) => !prev);
  };
  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
  };
  return (
    <div className={footerClass} >
      <div className="bg-dark text-light p-3 footer">
        <hr className='footer-hr'/>
        <div className='footer-divs'>
          <div className='button-footer'>{t('About us')}</div>
          <div className='button-footer'>{t('Contact')}</div>
          {isTranslateChangeVisible ? (    
            <div className='translate-main-div'>         
              <div className='translate-toggle-visible'>
                {Object.keys(translateTranscript).map(languageCode => {
                  if (languageCode == selectedLanguage) {
                    return (
                      <div className='language-flex-with-icon'>
                        <div key={languageCode} className='language-select-names selected-language'       
                        onClick={() => {
                          handleLanguageChange(languageCode);
                          handleToggleTranslateChange();
                        }}>
                          {translateTranscript[languageCode]}
                        </div>
                        <Icon icon="material-symbols-light:done" className="language-icon-done"/>
                      </div>
                    );
                  } else {
                    return (
                      <div key={languageCode} className='language-select-names' 
                      onClick={() => {
                        handleLanguageChange(languageCode);
                        handleToggleTranslateChange();
                      }}>
                        {translateTranscript[languageCode]}
                      </div>
                    );
                  }
                })}
                <hr className='footer-hr-select-language'/>
                <div className='language-flex-with-icon' onClick={handleToggleTranslateChange}>
                  <div className='translate-button-footer translate-button-visible'>{language}</div>
                </div>  
              </div>  
            </div> 
          ) : (
            <div className='translate-main-div'  onClick={handleToggleTranslateChange}>
              <div className='language-flex-with-icon'>
                <div className='translate-button-footer marginLeftTranslate'>{language}</div>
                <Icon icon="material-symbols-light:language" className="language-icon"/>
              </div>  
            </div> 
          )}
        </div>
      </div>
    </div>
  );
}

export default Footer;
