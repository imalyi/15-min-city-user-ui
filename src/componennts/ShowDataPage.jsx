import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShowDataPage.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { SlMenu } from 'react-icons/sl';
import Map from './Map';
import Footer from './Footer';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { UserLocationButton } from './UserLocationButton';
import ShowDataButton from './ShowDataButton';
import Roles from './Roles';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function ShowDataPage() {
  const [isRolesVisible, setIsRolesVisible] = useState(false);
  const location = useLocation();
  const places = location.state?.places || {};
  console.log(places);
  const address = location.state?.address || 'Unknown Address';
  const addressId = location.state?.addressId || 'Unknown Address';
  const aboutInfo = 'Information from Show-Adresses Component';
  const selectedPreferences = location.state?.selectedPreferences || [];
  const selectedCoordinates = location.state?.selectedCoordinates || [90, 90];
  const [results, setResults] = useState([]);
  const [input, setInput] = useState(address);
  const [addressIdShowPage, setAddressIdShowPage] = useState(addressId);
  const [isResultClicked, setIsResultClicked] = useState(true);
  const [selectedCoordinatesShowPage, setSelectedCoordinatesShowPage] =
    useState(selectedCoordinates);
  const [selectedPreferencesShowPage, setSelectedPreferencesShowPage] =
    useState(selectedPreferences);
  const buttonRef = useRef(null);

  const [flyToLocation, setFlyToLocation] = useState(null);

  const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(false);

  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
    //window.location.reload();
  };

  const handleToggleLeftSection = () => {
    setIsLeftSectionVisible((prev) => !prev);
  };

  const handleDataCategoryClick = (location) => {
    setFlyToLocation(location);
  };

  const handleEnterPress = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const handleResultClick = (result) => {
    setInput(result.address);
    setAddressIdShowPage(result.id);
    setSelectedCoordinatesShowPage([result.location[1], result.location[0]]);
    setIsResultClicked(true);
  };

  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  const handleUserLocationUpdate = (address, lat, lng) => {
    setInput(`${address[0].address}`);
    setAddressIdShowPage(`${address[0].id}`);
    setSelectedCoordinatesShowPage([lat, lng]);
    setIsResultClicked(true);
  };

  const handleToggleRoles = () => {
    setIsRolesVisible((prev) => !prev);
  };

  const handlePreferencesSelect = (preferences) => {
    setSelectedPreferencesShowPage(preferences);
  };

  // Tutaj możesz umieścić kod obsługujący zmiany preferencji lub innych danych
  // Wywołuje się za każdym razem, gdy selectedPreferencesShowPage zostanie zaktualizowane
  const categoriesToShow = selectedPreferences.map((preference) => {
    const formattedPreference = preference
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      key: preference,
      label: formattedPreference,
    };
  });

  // Tutaj możesz coś zrobić z categoriesToShow

  return (
    <div>
      <div className="showDataContainer">
        <div className="ShowDataPage">
          <div className="language-select-container-show-data">
            <Select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <MenuItem value="en">{t('English')}</MenuItem>
              <MenuItem value="pl">{t('Polish')}</MenuItem>
              <MenuItem value="de">{t('German')}</MenuItem>
              {/* Add more languages as needed */}
            </Select>
          </div>
          <div className="search-bar-container-show-data">
            <button
              onClick={handleToggleLeftSection}
              className="toggleLeftSectionButton"
              title={t('Show more information')}
            >
              {<SlMenu />}
            </button>
            <UserLocationButton
              onLocationUpdate={handleUserLocationUpdate}
              onEnterPress={handleEnterPress}
            />
            <div className="column-show-data search-bar-and-results-show-data results-container-show-data">
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
              addressId={addressIdShowPage}
              selectedPreferences={selectedPreferencesShowPage}
              selectedCoordinates={selectedCoordinatesShowPage}
            />
            <button
              onClick={handleToggleRoles}
              className="toggleRolesButton"
              title={t('Choose your preferences')}
            >
              {isRolesVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>

          {isRolesVisible && (
            <div>
              <Roles
                onSelectPreferences={handlePreferencesSelect}
                selectedPreferencesShowPage={selectedPreferencesShowPage}
              />
            </div>
          )}
          <div className="show-data-map">
            {isLeftSectionVisible && (
              <div className="left-section">
                {categoriesToShow.map((category) => (
                  <div key={category.key} className="data-category">
                    <h3>{t(category.label)}</h3>
                    {console.log(category.label)}
                    {places.osm.points_of_interest[category.key] ? (
                      <div className="no-info-container">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/4315/4315445.png"
                          alt="Red Cross"
                          className="centered-img-tick"
                        />
                      </div>
                    ) : null}
                    {places.osm.points_of_interest[category.key] &&
                    places.osm.points_of_interest[category.key].length > 0 ? (
                      <ul className="data-list">
                        {places.osm.points_of_interest[category.key]?.map(
                          (item, index) => (
                            <li
                              key={index}
                              className="data-list-item"
                              onClick={() =>
                                handleDataCategoryClick(item.location)
                              }
                            >
                              {item.name !== 'unknown' && (
                                <>
                                  <strong>{t('Name')}:</strong> {item.name}
                                  <br />
                                </>
                              )}
                              {item.address.full && (
                                <>
                                  <strong>{t('Address')}:</strong>{' '}
                                  {item.address.full}
                                  <br />
                                </>
                              )}
                              <strong>{t('Distance')}:</strong>{' '}
                              {item.distance < 1000
                                ? `${item.distance.toFixed(0)}m`
                                : `${(item.distance / 1000).toFixed(1)}km`}
                              <br />
                              {item.tags['contact:instagram'] && (
                                <>
                                  <strong>Instagram:</strong>{' '}
                                  <a href={item.tags['contact:instagram']}>
                                    {item.tags['contact:instagram']}
                                  </a>
                                  <br />
                                </>
                              )}
                              {item.tags['contact:facebook'] && (
                                <>
                                  <strong>Facebook:</strong>{' '}
                                  <a href={item.tags['contact:facebook']}>
                                    {item.tags['contact:facebook']}
                                  </a>
                                  <br />
                                </>
                              )}
                              {item.tags.mobile && (
                                <>
                                  <strong>Phone number:</strong>{' '}
                                  {item.tags.mobile}
                                  <br />
                                </>
                              )}
                              {item.tags['website:menu'] && (
                                <>
                                  <strong>Menu:</strong>{' '}
                                  <a href={item.tags['website:menu']}>
                                    {item.tags['website:menu']}
                                  </a>
                                  <br />
                                </>
                              )}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <div className="no-info-container">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png"
                          alt="Red Cross"
                          className="centered-img-cross"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div
              className={`right-section map-container ${
                isLeftSectionVisible ? '' : 'right-section-center'
              }`}
            >
              <Map
                places={places.osm.points_of_interest}
                categoriesToShow={categoriesToShow.map(
                  (category) => category.key,
                )}
                selectedCoordinatesShowPage={selectedCoordinates}
                flyToLocation={flyToLocation}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer additionalInfo={aboutInfo} />
      </div>
    </div>
  );
}

export default ShowDataPage;
