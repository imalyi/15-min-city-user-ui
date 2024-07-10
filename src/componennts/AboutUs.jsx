// About.jsx
import React, {useState, useEffect} from 'react';
import Footer from './Footer';
import { logger } from '../logger';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/AboutUs.css';

function AboutUs() {
  const { i18n, t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEmailClick = () => {
    const email = 'cityinminutes@mailbox.org';
    navigator.clipboard.writeText(email).then(() => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2450); // Popup zniknie po 2 sekundach
    });
  };

  return (
    <div className="home-container">
      <div className="language-select-container">
        <Link to="/">
          <motion.button
            className="logo-about-us"
            title={t('Search Page')}
            whileHover={{ scale: 1 }} // Przykładowa animacja przy najechaniu
            whileTap={{ scale: 1 }} // Przykładowa animacja przy kliknięciu
          >
            <img
              src={'/images/15min_logo.svg'}
              alt="Red Cross"
              className="centered-img-cross"
            ></img>
          </motion.button>
        </Link>
      </div>
      <div className='info-about-us-container'>
      <div>
        <h1 className="home-description-title" style={{marginTop: !isSmallScreen? '15vh' : '11vh'}}>
            {t(
              'We believe in cities where everything you need is at your fingertips.',
            )}
        </h1>
        <h2 className="home-description-third-title">
            {t(
              'Our team',
            )}
        </h2>
      </div>
      <div className='team-members'>
        <div className='team-member'>
            <p className='member-name'>Igor</p>
            <p className='member-role'>Back-end developer</p>
            <a href='https://www.linkedin.com/in/imalyi/' className='linkedin'>LinkedIn</a>
        </div>
        <div className='team-member'>
            <p className='member-name'>Artsem</p>
            <p className='member-role'>Front-end developer</p>
            <a href='https://www.linkedin.com/in/artsem-stankevich/' className='linkedin'>LinkedIn</a>
        </div>
        <div className='team-member'>
            <p className='member-name'>Monika</p>
            <p className='member-role'>UX/UI designer</p>
            <a href='https://www.linkedin.com/in/monika-slupska/' className='linkedin'>LinkedIn</a>
        </div>
      </div>
      <div>
        <h2 className="home-description-third-title">
            {t(
              'Do you have questions or suggestions?',
            )}
        </h2>
      </div>
      <div className="home-description-second-title"> 
        <span>              
            {t('Write to us at ')}
        </span>
        <span className="blue-link" onClick={handleEmailClick}>
          cityinminutes@mailbox.org
        </span>
            {showPopup && <div className="popup">            
            {t(
              'Address copied to clipboard!',
            )}
            </div>}
        </div>
        </div>
      <Footer useMargin={true} />
    </div>
  );
}

export default AboutUs;
