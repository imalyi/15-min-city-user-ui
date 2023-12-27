import React, { useState, useRef } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { UserLocationButton } from './UserLocationButton';
import { ShowDataButton } from './ShowDataButton';
//import HowItWorks from './HowItWorks';
import Roles from './Roles';
import { useTranslation } from 'react-i18next';

function Home() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [addressId, setAddressId] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const aboutInfo = 'Information from Home Component';
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

  const handleUserLocationUpdate = (address, lat, lng) => {
    setInput(`${address[0].address}`);
    setAddressId(`${address[0].id}`);
    console.log(lat, lng);
    setSelectedCoordinates([lat, lng]);
    setIsResultClicked(true);
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
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{
            height: '3rem', // Ustaw tutaj odpowiednią wysokość
            borderRadius: '4px', // Ustaw tutaj odpowiednią zaokrąglenie
            borderColor: 'white', // Ustaw tutaj odpowiedni kolor obramowania
            boxShadow: '0px 0px 8px #A9A9A9',
            backgroundColor: 'white', // Ustaw tutaj odpowiedni kolor tła
          }}
        >
          <option value="en">{t('English')}</option>
          <option value="pl">{t('Polish')}</option>
          <option value="de">{t('German')}</option>
          {/* Dodaj więcej opcji według potrzeb */}
        </select>
      </div>
      <div className="image-logo">
        <img
          src={'/images/15minuteLogo.png'}
          alt="Red Cross"
          className="centered-img-cross"
        />
      </div>
      <div className="search-bar-container">
        <UserLocationButton
          onLocationUpdate={handleUserLocationUpdate}
          onEnterPress={handleEnterPress}
        />
        <div className="column search-bar-and-results results-container">
          <SearchBar
            setResults={setResults}
            input={input}
            setInput={handleSearchBarChange}
            setIsResultClicked={setIsResultClicked}
            onEnterPress={handleEnterPress}
          />
          {results && results.length > 0 && !isResultClicked && (
            <SearchResultsList
              results={results}
              onResultClick={handleResultClick}
            />
          )}
        </div>
        <ShowDataButton
          ref={buttonRef}
          address={input}
          addressId={addressId}
          selectedRole={selectedRole}
          selectedPreferences={selectedPreferences}
          selectedCoordinates={selectedCoordinates}
        />
      </div>
      <div className="how-it-works-container">
        <Roles
          onSelectRole={handleRoleSelect}
          onSelectPreferences={handlePreferencesSelect}
          selectedRoleFromShowPage={selectedRole}
          selectedPreferencesShowPage={selectedPreferences}
        />
      </div>
      <Footer additionalInfo={aboutInfo} />
    </div>
  );
}

export default Home;
