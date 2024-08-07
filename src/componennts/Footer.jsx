import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';
import { logger } from '../logger';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

function Footer({ useMargin, SignIn }) {
  const footerClass = useMargin && !SignIn ? 'margin-footer' : '';
  const SignInClass = SignIn ? 'footer-sign-in' : '';

  const isVerySmallScreen = useMediaQuery({ query: '(max-width: 450px)' });
  const isSmallScreen = useMediaQuery({ query: '(min-width: 451px) and (max-width: 699px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 700px) and (max-width: 999px)' });
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1000px) and (max-width: 1299px)' });

  let panelWidth = '30vw';
  if (isVerySmallScreen) panelWidth = '100vw';
  if (isSmallScreen) panelWidth = '80vw';
  if (isMediumScreen) panelWidth = '60vw';
  if (isLargeScreen) panelWidth = '50vw';

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
        <hr 
          className={`footer-hr ${SignIn === true ? 'footer-hr-width' : ''}`}
        />
        <div className="footer-divs">
          <div className={SignInClass}>
            <div 
              onClick={handleAboutUsClick} 
              className={`button-footer ${SignIn === true ? 'button-footer-color' : ''}`}
            >
              {t('About us')}
            </div>
          </div>
          <div className="translate-main-div" onClick={handleToggleTranslateChange}>
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
        </div>
      </div>
      <AnimatePresence>
        {isTranslateChangeVisible && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: panelWidth }}
            exit={{ width: 0, transition: { duration: 0.3 } }}
            className="translate-panel"
            ref={translateRef}
          >

            <div className='translate-panel-header-and-icon'>
              <div className="translate-panel-header">
                {t('Choose your preferred language')}
              </div>
              <div className='language-close-icon-div'                   
              onClick={() => {
                handleToggleTranslateChange();
              }}>
                <Icon icon="material-symbols-light:close" id="close-icon-button-footer" />
              </div>
            </div>
            <div className="translate-panel-content">
              {Object.keys(translateTranscript).map((languageCode) => (
                <div
                  key={languageCode}
                  className={`language-select-names ${
                    languageCode === selectedLanguage ? 'selected-language' : ''
                  }`}
                  onClick={() => {
                    handleLanguageChange(languageCode);
                    handleToggleTranslateChange();
                  }}
                >
                  {translateTranscript[languageCode]}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Footer;
