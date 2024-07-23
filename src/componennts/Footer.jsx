import React, { useState, useEffect, useRef } from 'react';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';
import { logger } from '../logger';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

function Footer({ useMargin, SignIn }) {
  const footerClass = useMargin && !SignIn ? 'margin-footer' : '';
  const SignInClass = SignIn ? 'footer-sign-in' : '';

  const { i18n, t } = useTranslation();
  const [isTranslateChangeVisible, setTranslateChangeVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const navigate = useNavigate();
  const translateRef = useRef();

  const translateTranscript = {
    pl: 'Polski',
    en: 'English',
    de: 'Deutsch',
    ru: 'Русский',
    ua: 'Українська',
  };

  const language = translateTranscript[selectedLanguage];

  const handleToggleTranslateChange = () => {
    setTranslateChangeVisible((prev) => !prev);
  };

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
    const storedData = localStorage.getItem('myData');
    let request = {};
    if (storedData) {
      request = JSON.parse(storedData);
    }

    request.language = lng;

    localStorage.setItem('myData', JSON.stringify(request));
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (translateRef.current && !translateRef.current.contains(event.target)) {
        setTranslateChangeVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [translateRef]);

  const handleAboutUsClick = () => {
    navigate('/about-us');
  };

  return (
    <div className={footerClass}>
      <div className="bg-dark text-light p-3 footer">
        <hr className="footer-hr" />
        <div className="footer-divs">
          <div className={SignInClass}>
            <div 
              onClick={handleAboutUsClick} 
              className={`button-footer ${SignIn === true ? 'button-footer-color' : ''}`}
            >
              {t('About us')}
            </div>
          </div>
          {isTranslateChangeVisible ? (
            <div className="translate-main-div" ref={translateRef}>
              <div className="translate-toggle-visible">
                {Object.keys(translateTranscript).map((languageCode) => {
                  if (languageCode === selectedLanguage) {
                    return (
                      <div className="language-flex-with-icon" key={languageCode}>
                        <div
                          className="language-select-names selected-language"
                          onClick={() => {
                            handleLanguageChange(languageCode);
                            handleToggleTranslateChange();
                          }}
                        >
                          {translateTranscript[languageCode]}
                        </div>
                        <Icon
                          icon="material-symbols-light:done"
                          className="language-icon-done"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={languageCode}
                        className="language-select-names"
                        onClick={() => {
                          handleLanguageChange(languageCode);
                          handleToggleTranslateChange();
                        }}
                      >
                        {translateTranscript[languageCode]}
                      </div>
                    );
                  }
                })}
                <hr className="footer-hr-select-language" />
                <div
                  className="language-flex-with-icon"
                  onClick={handleToggleTranslateChange}
                >
                  <div className="translate-button-footer translate-button-visible">
                    {language}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="translate-main-div"
              onClick={handleToggleTranslateChange}
            >
              <div className="language-flex-with-icon">
                <div className="translate-button-footer marginLeftTranslate">
                  {language}
                </div>
                <Icon
                  icon="material-symbols-light:language"
                  className="language-icon"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Footer;
