import React from 'react';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';
function Footer() {
  const { t } = useTranslation();
  return (
    <div className='margin-footer'>
      <div className="bg-dark text-light p-3">
        <hr className='footer-hr'/>
        <button className='button-footer'>{t('About us')}</button>
        <button className='button-footer'>{t('Contact')}</button>
      </div>
    </div>
  );
}

export default Footer;
