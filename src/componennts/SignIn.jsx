import React, { useState } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import '../styles/SignIn.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, InputAdornment, IconButton, FormControl, InputLabel, Input } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function SignIn() {
  const { t } = useTranslation();
  const [option, setOption] = useState('sign-up');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const handleOptionChange = (option) => {
    setOption(option);
  };


  const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="home-container">
      <div className="language-select-container">
        <Link to="/">
          <motion.button
            className="logo_home"
            title={t('Search Page')}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 1 }}
          >
            <img
              src={'/images/15min_logo.svg'}
              alt="Red Cross"
              className="centered-img-cross"
            ></img>
          </motion.button>
        </Link>
      </div>
      <div className="search-bar-container">
        <div>
          <h1 className="sign-in-description-title">
            {t(
              'Imagine that getting to the points in the city that are important to you requires only a short walk.'
            )}
          </h1>
          <h2 className="sign-in-description-second-title">
            {t(
              'The idea of a 15-minute city is just such a vision - a life of convenience and proximity, where you will do your daily errands without long journeys, enjoying greater freedom.'
            )}
          </h2>
        </div>
        <div className="sign-up-right-section">
          <div className="choose-login-option">
            <div
              className={`sign-up-option ${option === 'sign-up' ? 'selected-option' : ''}`}
              onClick={() => handleOptionChange('sign-up')}
            >
              {t('Sign up')}
              {option === 'sign-up' && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ duration: 0.5 }}
                >
                  <hr className="choose-option-sign-up-hr" />
                </motion.div>
              )}
            </div>
            <div
              className={`login-option ${option === 'log-in' ? 'selected-option' : ''}`}
              onClick={() => handleOptionChange('log-in')}
            >
              {t('Log in')}
              {option === 'log-in' && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ duration: 0.5 }}
                >
                  <hr className="choose-option-sign-up-hr" />
                </motion.div>
              )}
            </div>
          </div>
          {option === 'sign-up' ? (
            <div>
                <div className='text-fields-div'>
                    <TextField id="standard-basic" label={t('Your Name')} variant="standard" className='text-field-default'/>
                    <TextField id="standard-basic" label={t('Address e-mail')} variant="standard"  className='text-field-default' style={{marginTop: '3vh'}}/>
                    <FormControl variant="standard" className='text-field-default' style={{marginTop: '3vh'}}>
                        <InputLabel htmlFor="standard-adornment-password">{t('Password')}</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>
                    <div className='sign-up-button'>
                    <div className='sign-up-button-label'>{t('Sign up')}</div>
                </div>
            </div>
          ) : option === "log-in" ? (
            <div>
                <div className='text-fields-div'>
                    <TextField id="standard-basic" label={t('Adress e-mail')} variant="standard"  className='text-field-default'/>
                    <FormControl variant="standard" className='text-field-default' style={{marginTop: '3vh'}}>
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>
                <div className='sign-up-button'>
                    <div className='sign-up-button-label'>{t('Log in')}</div>
                </div>
            </div>
          ) : null}

        </div>
      </div>
      <Footer useMargin={true} />
    </div>
  );
}

export default SignIn;
