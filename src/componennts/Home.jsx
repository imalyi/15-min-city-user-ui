import React, { useState, useRef, useEffect } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { ShowDataButton } from './ShowDataButton';
//import HowItWorks from './HowItWorks';
import Roles from './Roles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"
import {icon} from "./anim.js"

function Home() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [addressId, setAddressId] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const [selectedRole, setSelectedRole] = useState('without role');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
    //window.location.reload();
  };

  //const howItWorksText = '***Description of page functions***';

  const buttonRef = useRef(null); // Dodaj ref do przycisku

  const handleEnterPress = () => {
    // Po naciśnięciu Enter, naciśnij przycisk ShowDataButton
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const handleResultClick = (result) => {
    setInput(result);
    setAddressId(result);
    setIsResultClicked(true);
    setTimeout(handleEnterPress, 20);
  };


  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handlePreferencesSelect = (preferences) => {
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
          >
          </img>
          </motion.button>
        </Link>
        {/* 
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="language-select"
        >
          <option value="en">{t('English')}</option>
          <option value="pl">{t('Polish')}</option>
          <option value="de">{t('German')}</option>
        </select>
        */}
      </div>
      <div className="search-bar-container">
        <div className="column search-bar-and-results results-container">
          <h1 className="home-description-title">{t('Imagine that getting to the points in the city that are important to you requires only a short walk.')}</h1>
          <h2 className="home-description-second-title">{t('The idea of a 15-minute city is just such a vision - a life of convenience and proximity, where you will do your daily errands without long journeys, enjoying greater freedom.')}</h2>
          <h2 className="home-description-third-title">{t('Enter the address of your choice, indicate the facilities you are using and make sure you have everything at hand where you are staying.')}</h2>
          <SearchBar
            setResults={setResults}
            showDataRef={buttonRef}
            input={input}
            addressId={addressId}
            setInput={handleSearchBarChange}
            setIsResultClicked={setIsResultClicked}
            onEnterPress={handleEnterPress}
            searchBarClassName="home-search-bar"
            selectedPreferences={selectedPreferences}
          />
          <div className='relative'>

          {results && results.length > 0 && !isResultClicked && (
            
            <SearchResultsList
              results={results}
              onResultClick={handleResultClick}
              searchResultsListClassName="home-search-result-list"
              searchResultsClassName="home-search-list"
            />
          )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
