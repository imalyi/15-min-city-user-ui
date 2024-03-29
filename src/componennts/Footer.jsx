import React from 'react';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';
function Footer({ useMargin })  {
  const { t } = useTranslation();
  const footerClass = useMargin ? 'margin-footer' : '';
  return (
    <div className={footerClass}>
      <div className="bg-dark text-light p-3">
        <hr className='footer-hr'/>
        <button className='button-footer'>{t('About us')}</button>
        <button className='button-footer'>{t('Contact')}</button>
      </div>
    </div>
  );
}

export default Footer;
