// About.jsx
import React, {useState, useEffect} from 'react';
import Footer from './Footer';
import { logger } from '../logger';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton, FormControl, InputLabel, Input, FormHelperText, Box  } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/AboutUs.css';
import { useCookies } from 'react-cookie';
import api from '../config';

import { AdressFetch, useAuthFetch, UserFetch } from './api.jsx';

function AboutUs() {
  const { i18n, t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);
  const [typesOfMesseges, setTypesOfMesseges] = useState([
    {id: 1, name: 'Error in the application', selected: false},
    {id: 2, name: 'Difficulty of use', selected: false},
    {id: 3, name: 'Idea', selected: false},
    {id: 4, name: 'Collaboration', selected: false},
    {id: 5, name: 'Other', selected: false}
  ]);
  const [cookies, setCookie] = useCookies(['token']);
  const { fetchWithAuth, token } = useAuthFetch();


  const [valuesMessage, setValuesMessage] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await UserFetch(api.APP_URL_USER_API, cookies.token, fetchWithAuth);
        logger.log('User info:', userInfo);
        setValuesMessage({
          ...valuesMessage,
          name: userInfo.name,
          email: userInfo.email
        });
      } catch (error) {
        logger.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []); // Pusty array dependency oznacza, że useEffect uruchomi się tylko raz, po zamontowaniu komponentu

  const handleEmailClick = () => {
    const email = 'cityinminutes@mailbox.org';
    navigator.clipboard.writeText(email).then(() => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2450); // Popup zniknie po 2.45 sekundach
    });
  };

  const handleTypeOfMessageClick = (id) => {
    const types = typesOfMesseges.map((type) => {
      if (type.id === id) {
        type.selected = !type.selected;
      } else {
        type.selected = false;
      }
      return type;
    });
    setTypesOfMesseges(types);
  }

  useEffect(() => {
    const handleResizeObserverError = () => {
      const observer = new ResizeObserver(() => {});
      observer.observe(document.body);
      observer.disconnect();
    };
  
    window.addEventListener('error', handleResizeObserverError);
    return () => window.removeEventListener('error', handleResizeObserverError);
  }, []);

  return (
    <div className="about-us-container">
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
        <div className="home-description-second-title" style={{marginTop:'1vh'}}> 
          <span>              
              {t('Write to us at ')}
          </span>
          <span className="blue-link" onClick={handleEmailClick}>
            cityinminutes@mailbox.org
          </span>
          <span>              
              {t(' or use the form below. ')}
          </span>
          {showPopup && 
            <div className="popup">            
              {t(
                'Address copied to clipboard!',
              )}
            </div>
          }
      </div>
      <div className="home-description-second-title" style={{marginTop:'8vh'}}> 
          <span>              
              {t('What would you like to communicate to us?')}
          </span>
      </div>
      <div className="types-of-messages"> 
          {typesOfMesseges.map((type) => (
            <div 
              key={type.id} 
              className={`type-of-message ${type.selected ? 'type-of-message-selected' : ''}`} 
              onClick={() => { handleTypeOfMessageClick(type.id)}}
            >
              {t(type.name)}
            </div>
          ))}
      </div>
      <div>
        <div className='text-fields-div-about-us'>
          <div className='text-fileds-in-row-about-us'>
            <TextField 
              id="standard-basic" 
              label={t('Your Name')} 
              variant="standard" 
              className='text-field-default-about-us text-field-default-about-us-name'
              value={valuesMessage.name} 
              onChange={(e) => setValuesMessage({...valuesMessage, name: e.target.value})}
              autoComplete="no"
            />
            <TextField 
              id="standard-basic" 
              label={t('Address e-mail')} 
              variant="standard"  
              className='text-field-default-about-us text-field-default-about-us-email' 
              value={valuesMessage.email} 
              onChange={(e) => setValuesMessage({...valuesMessage, email: e.target.value})}
              autoComplete="no"
            />
          </div>
          <TextField 
            fullWidth
            id="standard-basic" 
            label={t('Message')} 
            variant="standard"  
            className='text-field-default-about-us' 
            style={{
              marginTop: '3vh',
            }}
            value={valuesMessage.message} 
            onChange={(e) => setValuesMessage({...valuesMessage, message: e.target.value})}
            multiline
            rows={4}
          />
          <div>
            <div className='send-button-about-us'>
              <div className='send-button-about-us-text'>
                {t('Send')}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <Footer useMargin={true} />
    </div>
  );
}

export default AboutUs;
