import React, { useState, useRef, useEffect } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { ShowDataButton } from './ShowDataButton';
import Roles from './Roles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { icon } from './anim.js';
import { logger } from '../logger';
import api from '../config';
import { set } from 'animejs';
import { useCookies } from 'react-cookie';
import md5 from 'md5';

function Home() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [addresses, setAddresses] = useState('');
  const [addressId, setAddressId] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const [selectedRole, setSelectedRole] = useState('without role');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedPreferencesTransformed, setSelectedPreferencesTransformed] =
    useState([]);
  const [alarm, setAlarm] = useState('');
  const [selectedPreferencesSearch, setSelectedPreferencesSearch] = useState(
    [],
  );
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const [cookies, setCookie] = useCookies(['userID']);

  useEffect(() => {
    if (cookies.userID) {
      loadData(cookies.userID);
    } else {
      handleNewUserRegistration();
    }
  }, []);

  const loadData = async (id) => {
    try {
      const response = await fetch(
        `${api.APP_URL_USER_API}user/load?secret=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setInput((prevInput) => {
          if (prevInput === '') {
            return data.request.addresses[0];
          }
          return prevInput;
        });
        handleSetCustomAdressesAndObjects(data.request);
        handleSetPreferences(data.request);
        setSelectedPreferencesTransformed(data.request.categories);
        i18n.changeLanguage(data.language);
        setAddresses(data.request.addresses);
      } else {
        console.error('Error getting report:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting report:', error);
    }
  };

  const generateUserID = () => {
    const timestamp = new Date().getTime();
    const randomNumber =
      Math.floor(Math.random() * (999999999 - 1000 + 1)) + 1000;
    const combinedString = timestamp.toString() + randomNumber.toString();
    const userID = md5(combinedString);
    return userID;
  };

  const handleNewUserRegistration = async () => {
    const userID = generateUserID();
    setCookie('userID', userID); // Set userID cookie
  };

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
  };
  const buttonRef = useRef(null);

  const handleEnterPress = () => {
    //TODO: Add logic to handle enter press
    /*
    if (results.length !== 0) {
      setInput(results[0]);
    }
    */
    setIsResultClicked(true);
    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.click();
      }, 10); // Czas w milisekundach (tutaj 100000ms = 100s)
    }
  };

  const handleResultClick = (result) => {
    setInput(result);
    setAddressId(result);
    setIsResultClicked(true);
    setTimeout(handleEnterPress, 20);
  };

  const handleSearchBarChange = (value) => {
    setAlarm('');
    setInput(value);
    setIsResultClicked(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handlePreferencesSelect = (preferences) => {
    setSelectedPreferences(preferences);
  };

  const handleSetCustomAdressesAndObjects = (data) => {
    const customObjectsAndAdresses = [];
    data.requested_addresses.forEach((item) => {
      customObjectsAndAdresses.push(item);
    });
    data.requested_objects.forEach((item) => {
      customObjectsAndAdresses.push({
        name: item.name,
        category: item.main_category,
        sub_category: item.category,
      });
    });
    setSelectedPreferencesSearch(customObjectsAndAdresses);
  };

  const handleSetPreferences = (data) => {
    const preferences = [];
    data.categories.forEach((item) => {
      preferences.push({
        name: item.category,
      });
    });
    setSelectedPreferences(preferences);
  };

  return (
    <div className="home-container">
      <div className="language-select-container">
        <Link to="/">
          <motion.button
            className="logo_home"
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
      <div className="search-bar-container">
        <div className="column search-bar-and-results results-container">
          <h1 className="home-description-title">
            {t(
              'Imagine that getting to the points in the city that are important to you requires only a short walk.',
            )}
          </h1>
          <h2 className="home-description-second-title">
            {t(
              'The idea of a 15-minute city is just such a vision - a life of convenience and proximity, where you will do your daily errands without long journeys, enjoying greater freedom.',
            )}
          </h2>
          <SearchBar
            setResults={setResults}
            showDataRef={buttonRef}
            input={input}
            addresses={addresses}
            addressId={addressId}
            setInput={handleSearchBarChange}
            setIsResultClicked={setIsResultClicked}
            onEnterPress={handleEnterPress}
            searchBarClassName={
              results && results.length > 0 && !isResultClicked
                ? 'border-bottom home-searchBar'
                : 'home-searchBar'
            }
            selectedPreferences={selectedPreferences}
            preferencesSearchData={selectedPreferencesSearch}
            transformedPreferences={selectedPreferencesTransformed}
            setAlarm={setAlarm}
          />
          <div className="relative">
            <div className="home-alarm">{t(alarm)}</div>
            {!isResultClicked && (
              <SearchResultsList
                results={results}
                onResultClick={handleResultClick}
                searchResultsListClassName="home-search-result-list"
                searchResultsClassName="home-search-list"
              />
            )}
            <h2 className="home-description-third-title">
              {t(
                'Enter the address of your choice, indicate the facilities you are using and make sure you have everything at hand where you are staying.',
              )}
            </h2>
          </div>
        </div>
      </div>
      <Footer useMargin={true} />
    </div>
  );
}

export default Home;