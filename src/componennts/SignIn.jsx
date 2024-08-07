import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import '../styles/SignIn.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, InputAdornment, IconButton, FormControl, InputLabel, Input, FormHelperText  } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useCookies } from 'react-cookie';
import { RegistrationFetch, LoginFetch, useAuthFetch } from './api.jsx';
import api from '../config';
import { logger } from '../logger';
import { use } from 'i18next';


function SignIn() {
  const { t } = useTranslation();
  const [option, setOption] = useState('sign-up');
  const [optionSmall, setOptionSmall] = useState('default');
  const [showPassword, setShowPassword] = React.useState(false);
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const isDefault = optionSmall !== 'sign-up' && optionSmall !== 'log-in' && optionSmall !== 'pre-log-in';
  const [cookies, setCookie] = useCookies(['token']);
  const [valuesForgotPassword, setValuesForgotPassword] = useState({
    email: '',
  });
  const { fetchWithAuth, token } = useAuthFetch();


  const [valuesSignUp, setValuesSignUp] = useState({
    name: '',
    email: '',
    password: '',
    showPassword: false,
    nameError: false,
    emailError: false,
    passwordError: false,
  });

  const [valuesLogIn, setValuesLogIn] = useState({
    email: '',
    password: '',
    showError: false,
    showPassword: false,
  });

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450 || window.innerWidth / window.innerHeight < 1);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450 || window.innerWidth / window.innerHeight < 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleChangeValuesSignUp = (prop) => (event) => {
    setValuesSignUp({ ...valuesSignUp, [prop]: event.target.value });

    if (prop === 'password') {
      setValuesSignUp({ 
            ...valuesSignUp, 
            [prop]: event.target.value,
            passwordError: event.target.value.length <= 8 
        });
    }
    if (prop === 'name') {
      setValuesSignUp({ 
            ...valuesSignUp, 
            [prop]: event.target.value,
            nameError: event.target.value.length <= 3 
        });
    }
    if (prop === 'email') {
      setValuesSignUp({ 
            ...valuesSignUp, 
            [prop]: event.target.value,
            emailError: !event.target.value.includes('@') || !event.target.value.includes('.')  
        });
    }
  };
  const handleChangeValuesLogIn = (prop) => (event) => {
    valuesLogIn.showError = false;
    setValuesLogIn({ ...valuesLogIn, [prop]: event.target.value });
  };

  const handleChangeValuesForgotPassword = (prop) => (event) => {
    setValuesForgotPassword({ ...valuesForgotPassword, [prop]: event.target.value });
  };

  const handleForgotPasswrodChange = () => {
    setForgotPassword((forgot) => !forgot);
  };


  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const handleOptionChange = (option) => {
    setOption(option);
  };

  const handleOptionChangeSmall = (option) => {
    setOptionSmall(option);
  }

  const handleUserRegistration = async () => {
    try {
      if (valuesSignUp.nameError || valuesSignUp.emailError || valuesSignUp.passwordError || valuesSignUp.email === '' || valuesSignUp.name === '' || valuesSignUp.password === '') {
        return;
      }
      const requestBody = {
        name: valuesSignUp.name,
        email: valuesSignUp.email,
        password: valuesSignUp.password,
      };
      const data = await RegistrationFetch(api.APP_URL_USER_API, requestBody, fetchWithAuth);
      logger.log(data)
      setOption('pre-log-in');
      setOptionSmall('pre-log-in');
    } catch (error) {
      console.error('Error fetching preferences data:', error);
    }
  }

  const handleUserLogin = async () => {
    try {
      if (valuesLogIn.email === '' || valuesLogIn.password === '' || valuesLogIn.showError) {
        return;
      }
      const requestBody = {
        username: valuesLogIn.email,
        password: valuesLogIn.password,
      };
      const data = await LoginFetch(api.APP_URL_USER_API, requestBody, fetchWithAuth);
      logger.log(data.access_token);
      setCookie('token', data.access_token);
    } catch (error) {
      console.error('Error fetching preferences data:', error);
      setValuesLogIn({ ...valuesLogIn, showError: true });
    }
  }

  useEffect(() => {
    if (cookies.token) {
      window.location.href = '/';
    }
  }, [cookies]);


  return (
    <div>
      {isSmallScreen === true ? (
        <div className="sign-in-container"> 
          <div className="language-select-container">
          <div 
            className={`${optionSmall === 'sign-up' ||  optionSmall === 'log-in' ||  optionSmall === 'pre-log-in' ? '' : 'language-select-sign-up-small'}`}
          >
          <Link to="/sign-in">
            <motion.button
              className="logo_home"
              style={isDefault ? { backgroundColor: '#DCE6FA' } : {}}
              title={t('Search Page')}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
              onClick={() => handleOptionChangeSmall("default")}
            >
              <img
                src={'/images/15min_logo.svg'}
                alt="Red Cross"
                className="centered-img-cross"
                style={isDefault ? { backgroundColor: '#DCE6FA' } : {}}
              ></img>
            </motion.button>
          </Link>
          </div>
          </div>
          <div className='search-bar-container-small'>
            {optionSmall === 'default' ? (
              <div className='sign-in-titles-small'>
                <h1 className="sign-in-description-title-small">
                  {t(
                    'Imagine that getting to the points in the city that are important to you requires only a short walk.'
                  )}
                </h1>
                <h2 className="sign-in-description-second-title-small">
                  {t(
                    'The idea of a 15-minute city is just such a vision - a life of convenience and proximity, where you will do your daily errands without long journeys, enjoying greater freedom.'
                  )}
                </h2>
              </div>
            ) : null}
            {optionSmall === 'default' ? (
              <div>
                <div className='sign-in-buttons-small'>
                  <div className='sign-up-button-small' onClick={() => handleOptionChangeSmall("sign-up")}>
                    <div className='sign-up-button-label-small'>{t('Sign up')}</div>
                  </div>
                  <div className='log-in-button-small' onClick={() => handleOptionChangeSmall("log-in")}>
                    <div className='log-in-button-label-small'>{t('Log in')}</div>
                </div>
             </div>
            </div>
            ) : optionSmall === 'sign-up' ? (
              <div>
                <div className='title-small'>
                  <div className='title-small-text'>{t('Sign up')}</div> 
                </div> 
                <div className='text-fields-div-small'>
                  <TextField 
                    id="standard-basic" 
                    label={t('Your Name')} 
                    variant="standard" 
                    className='text-field-default-small'
                    value={valuesSignUp.name} 
                    error={valuesSignUp.nameError}
                    onChange={handleChangeValuesSignUp('name')}
                    helperText={valuesSignUp.nameError ? t('Name must be longer than 3 characters') : ' '}
                    FormHelperTextProps={{
                      style: { fontSize: '1vh' } // Dodanie stylu inline
                    }}
                  />
                  <TextField 
                    id="standard-basic" 
                    label={t('Address e-mail')} 
                    variant="standard"  
                    className='text-field-default-small' 
                    value={valuesSignUp.email} 
                    error={valuesSignUp.emailError}
                    onChange={handleChangeValuesSignUp('email')}
                    helperText={valuesSignUp.emailError ? t('Incorrect email') : ' '}
                    FormHelperTextProps={{
                      style: { fontSize: '1vh' } // Dodanie stylu inline
                    }}
                  />
                  <FormControl 
                    variant="standard" 
                    className='text-field-default-small' 
                    error={valuesSignUp.passwordError}
                  >
                      <InputLabel htmlFor="standard-adornment-password">{t('Password')}</InputLabel>
                      <Input
                          id="standard-adornment-password"
                          type={showPassword ? 'text' : 'password'}
                          value={valuesSignUp.password}
                          onChange={handleChangeValuesSignUp('password')}
                          endAdornment={
                          <InputAdornment position="end">
                              <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                          </InputAdornment>
                          }
                      />
                      {valuesSignUp.passwordError ? (
                        <FormHelperText error style={{fontSize:"1vh"}}>{t('Password must be longer than 8 characters')}</FormHelperText>
                      ) : (
                        <FormHelperText style={{fontSize:"1vh"}}>{' '}</FormHelperText>
                      )}
                  </FormControl>
                  <div>
                    <div className='terms-and-conditions-small'>
                      {t('Creating an account is equivalent to accepting ')} <a className='blue-link' href="https://www.termsfeed.com/live/52215264-c2c7-42ed-9987-b99da269e480" target="_blank" rel="noopener noreferrer">{t('Terms and Conditions')}</a> {/*{t(' and ')} <a className='blue-link' href="https://www.termsfeed.com/live/52215264-c2c7-42ed-9987-b99da269e480" target="_blank" rel="noopener noreferrer">{t('Privacy Policy')}</a>*/}
                    </div>
                  </div>
                </div>
                
                <div className={`${valuesSignUp.nameError || valuesSignUp.emailError || valuesSignUp.passwordError || valuesSignUp.email === '' || valuesSignUp.name === '' || valuesSignUp.password === '' ? 'sign-up-button-small-invalid-data' : 'sign-up-button-small'}`} onClick={() => handleUserRegistration()}>
                      <div className='sign-up-button-label'>{t('Sign up')}</div>
                </div>
              </div>
            ) : optionSmall === 'log-in' ? (
              <div>
                <div className='title-small'>
                  <div className='title-small-text'>{t('Log in')}</div> 
                </div> 
                <div className='text-fields-div-small'>
                  <TextField 
                    id="standard-basic" 
                    label={t('Address e-mail')} 
                    variant="standard"  
                    className='text-field-default-small' 
                    value={valuesLogIn.email} 
                    onChange={handleChangeValuesLogIn('email')}
                  />
                  <FormControl 
                    variant="standard" 
                    className='text-field-default-small' 
                    error={valuesLogIn.showError}
                    style={{marginTop: '3vh'}}
                  >
                      <InputLabel htmlFor="standard-adornment-password">{t('Password')}</InputLabel>
                      <Input
                          id="standard-adornment-password"
                          type={showPassword ? 'text' : 'password'}
                          value={valuesLogIn.password}
                          onChange={handleChangeValuesLogIn('password')}
                          endAdornment={
                          <InputAdornment position="end">
                              <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                          </InputAdornment>
                          }
                      />
                      {valuesLogIn.showError && (
                        <FormHelperText error style={{fontSize:"1vh"}}>{t('Incorrect email or password')}</FormHelperText>
                      )}
                  </FormControl>
                </div>
                <div className='forgot-password'>
                      <Link className='blue-link' onClick={() => handleForgotPasswrodChange()}>{t('Forgot your password?')}</Link>
                </div>
                <div className={`${valuesLogIn.password === '' || valuesLogIn.name === '' ? 'sign-up-button-small-invalid-data' : 'sign-up-button-small'}`} onClick={() => handleUserLogin()}>
                  <div className='sign-up-button-label'>{t('Log in')}</div>
                </div>
              </div>
            ) : optionSmall === 'pre-log-in' ? (
              <div className='pre-log-in-title-small'>
                <div className='pre-log-in-title-text'>{t('You have successfully registered')}</div>
                <div className='pre-log-in-subtitle-text'>{t('Please log in')}</div>
                <div>
                  <div className='sign-up-button' onClick={() => handleOptionChangeSmall('log-in')}>
                    <div className='sign-up-button-label'>{t('Log in')}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Footer useMargin={true} />
        </div>
        
      ) : (
        <div className="sign-in-container">
        <div className="language-select-container">
          <div className="language-select-sign-up">
          <Link to="/sign-in">
            <motion.button
              className="logo_home"
              style={{backgroundColor: '#DCE6FA'}}
              title={t('Search Page')}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
            >
              <img
                src={'/images/15min_logo.svg'}
                alt="Red Cross"
                className="centered-img-cross"
                style={{backgroundColor: '#DCE6FA'}}
              ></img>
            </motion.button>
          </Link>
          </div>
        </div>
        <div className="search-bar-container">
          <div className='sign-up-left-section'>
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
            {option === 'pre-log-in' ? (
                  <div className='pre-log-in-title'>
                    <div className='pre-log-in-title-text'>{t('Welcome on board!')}</div>
                    <div className='pre-log-in-subtitle-text'>{t('Log in to your account to start using the application.')}</div>
                    <div>
                      <div className='sign-up-button' onClick={() => handleOptionChange('log-in')}>
                        <div className='sign-up-button-label'>{t('Log in')}</div>
                      </div>
                    </div>
                  </div>
            ) : forgotPassword === true ? (
              <div>
                <div className='text-fields-div'>
                  <div>
                    <div className="forgot-password-title">
                      <div className='forgot-password-title-text'>{t('Forgot your password?')}</div>
                      <div className='forgot-password-subtitle-text'>{t('Enter your email address and click the button. We will send you a link to reset your password.')}</div>
                    </div>
                  </div>
                </div>
                <div className='text-fields-div'>
                  <TextField 
                    id="standard-basic" 
                    label={t('Address e-mail')} 
                    variant="standard"  
                    className='text-field-default'
                    value={valuesForgotPassword.email} 
                    onChange={handleChangeValuesForgotPassword('email')}
                  />
                </div>
                <div 
                  className={`send-button ${valuesForgotPassword.email === '' ? 'send-empty' : ''}`}
                >
                  <div className='sign-up-button-label'>{t('Send')}</div>
                </div>
                <div className='back-to-login-button' onClick={() => handleForgotPasswrodChange()}>
                  <div className='back-to-login-button-label'>{t('Back to Login')}</div>
                </div>
              </div>
            ) : (
            <div>
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
                      <TextField 
                        id="standard-basic" 
                        label={t('Your Name')} 
                        variant="standard" 
                        className='text-field-default'
                        value={valuesSignUp.name} 
                        error={valuesSignUp.nameError}
                        onChange={handleChangeValuesSignUp('name')}
                        helperText={valuesSignUp.nameError ? t('Name must be longer than 3 characters') : ' '}
                        FormHelperTextProps={{
                          style: { fontSize: '1.5vh' } // Dodanie stylu inline
                        }}
                      />
                      <TextField 
                        id="standard-basic" 
                        label={t('Address e-mail')} 
                        variant="standard"  
                        className='text-field-default' 
                        error={valuesSignUp.emailError}
                        value={valuesSignUp.email} 
                        onChange={handleChangeValuesSignUp('email')}
                        helperText={valuesSignUp.emailError ? t('Incorrect email') : ' '}
                        FormHelperTextProps={{
                          style: { fontSize: '1.5vh' } // Dodanie stylu inline
                        }}
                      />
                      <FormControl 
                        variant="standard" 
                        className='text-field-default' 
                        error={valuesSignUp.passwordError}
                      >
                          <InputLabel htmlFor="standard-adornment-password">{t('Password')}</InputLabel>
                          <Input
                              id="standard-adornment-password"
                              type={showPassword ? 'text' : 'password'}
                              value={valuesSignUp.password}
                              onChange={handleChangeValuesSignUp('password')}
                              endAdornment={
                              <InputAdornment position="end">
                                  <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                              </InputAdornment>
                              }
                          />
                          {valuesSignUp.passwordError ? (
                            <FormHelperText error style={{fontSize:"1.5vh"}}>{t('Password must be longer than 8 characters')}</FormHelperText>
                          ) : (
                            <FormHelperText style={{fontSize:"1.5vh"}}>{' '}</FormHelperText>
                          )}
                      </FormControl>
                  <div>
                    <div className='terms-and-conditions'>
                      {t('Creating an account is equivalent to accepting ')} <a className='blue-link' href="https://www.termsfeed.com/live/52215264-c2c7-42ed-9987-b99da269e480" target="_blank" rel="noopener noreferrer">{t('Terms and Conditions')}</a> {/*{t(' and ')} <a className='blue-link' href="https://www.termsfeed.com/live/52215264-c2c7-42ed-9987-b99da269e480" target="_blank" rel="noopener noreferrer">{t('Privacy Policy')}</a>*/}
                    </div>
                  </div>
                  </div>
                  <div className={`${valuesSignUp.nameError || valuesSignUp.emailError || valuesSignUp.passwordError || valuesSignUp.email === '' || valuesSignUp.name === '' || valuesSignUp.password === '' ? 'sign-up-button-invalid-data' : 'sign-up-button'}`} onClick={() => handleUserRegistration()}>
                      <div className='sign-up-button-label' >{t('Sign up')}</div>
                  </div>
                </div>
            ) : option === "log-in" ? (
              <div>
                  <div className='text-fields-div'>
                      <TextField 
                        id="standard-basic" 
                        label={t('Address e-mail')} 
                        variant="standard"  
                        className='text-field-default'
                        value={valuesLogIn.email} 
                        onChange={handleChangeValuesLogIn('email')}
                    />
                      <FormControl 
                        variant="standard" 
                        className='text-field-default' 
                        error={valuesLogIn.showError}
                        style={{marginTop: '3vh'}}
                    >
                          <InputLabel htmlFor="standard-adornment-password">{t('Password')}</InputLabel>
                          <Input
                              id="standard-adornment-password"
                              type={showPassword ? 'text' : 'password'}
                              value={valuesLogIn.password}
                              onChange={handleChangeValuesLogIn('password')}
                              endAdornment={
                              <InputAdornment position="end">
                                  <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                              </InputAdornment>
                              }
                          />
                          {valuesLogIn.showError && (
                            <FormHelperText error style={{fontSize:"1.5vh"}}>{t('Incorrect email or password')}</FormHelperText>
                          )}
                      </FormControl>
                  </div>
                  <div className='forgot-password'>
                      <Link className='blue-link' onClick={() => handleForgotPasswrodChange()}>{t('Forgot your password?')}</Link>
                  </div>
                  <div className={`${valuesLogIn.password === '' || valuesLogIn.name === '' ? 'sign-up-button-invalid-data' : 'sign-up-button'}`} onClick={() => handleUserLogin()}>
                      <div className='sign-up-button-label'>{t('Log in')}</div>
                  </div>
              </div>
              ) : null}
            </div>
            )}
            
          </div>
        </div>
        <Footer useMargin={true} SignIn={true} />
      </div>
      )}
    </div>
  );
}

export default SignIn;
