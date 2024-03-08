import React, { useState, useRef } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { ShowDataButton } from './ShowDataButton';
//import HowItWorks from './HowItWorks';
import Roles from './Roles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Home() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [addressId, setAddressId] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const [selectedRole, setSelectedRole] = useState('without role');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);

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
    setInput(result.address);
    setAddressId(result.id);
    setSelectedCoordinates([result.location[1], result.location[0]]);
    setIsResultClicked(true);
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
      <div classname="logo">

      </div>
      <div className="language-select-container">
        <Link to="/">
          <button
            className="logo"
            title={t('Search Page')}
          >
            logo
          </button>
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
          <SearchBar
            setResults={setResults}
            showDataRef={buttonRef}
            input={input}
            addressId={addressId}
            selectedCoordinates={selectedCoordinates}
            setInput={handleSearchBarChange}
            setIsResultClicked={setIsResultClicked}
            onEnterPress={handleEnterPress}
            searchBarClassName="home-search-bar"
          />
          {results && results.length > 0 && !isResultClicked && (
            <SearchResultsList
              results={results}
              onResultClick={handleResultClick}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
