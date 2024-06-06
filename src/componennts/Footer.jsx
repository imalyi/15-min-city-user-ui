import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';
import { logger } from '../logger';
import { Icon } from '@iconify/react';

function Footer({ useMargin }) {
  const footerClass = useMargin ? 'margin-footer' : '';
  const { i18n, t } = useTranslation();
  const [isTranslateChangeVisible, setTranslateChangeVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const translateTranscript = {
    pl: 'Polski',
    en: 'English',
    de: 'Deutsch',
  };
  const language = translateTranscript[selectedLanguage];
  const handleToggleTranslateChange = () => {
    setTranslateChangeVisible((prev) => !prev);
  };
  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const [copied, setCopied] = useState(false);

  const handleCopyAndOpenMail = () => {
    // Adres e-mail, który chcesz skopiować i otworzyć w kliencie poczty
    const email = 'contact_with_cityinminutes@pm.me';

    // Kopiowanie adresu e-mail do schowka
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.error('Failed to copy email: ', error);
      });

    // Otwarcie klienta poczty e-mail
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className={footerClass}>
      <div className="bg-dark text-light p-3 footer">
        <hr className="footer-hr" />
        <div className="footer-divs">
          <div className="button-footer">{t('About us')}</div>
          <div className="mail-button" onClick={handleCopyAndOpenMail}>
            <div className="button-footer-contact">{t('Contact us')}</div>
            <div>
              <Icon
                icon="material-symbols-light:mail-outline"
                id="mail-icon-button"
              />
            </div>
          </div>
          {isTranslateChangeVisible ? (
            <div className="translate-main-div">
              <div className="translate-toggle-visible">
                {Object.keys(translateTranscript).map((languageCode) => {
                  if (languageCode == selectedLanguage) {
                    return (
                      <div className="language-flex-with-icon">
                        <div
                          key={languageCode}
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
