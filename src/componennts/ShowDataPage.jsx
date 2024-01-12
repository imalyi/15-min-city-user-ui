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
import { Link } from 'react-router-dom';

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

  const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(true);

  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const [categoryVisibility, setCategoryVisibility] = useState({});

  const handleCategoryLabelClick = (categoryKey) => {
    setCategoryVisibility((prevVisibility) => ({
      ...prevVisibility,
      [categoryKey]: !prevVisibility[categoryKey],
    }));
  };

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

  categoriesToShow.sort((a, b) => {
    const hasPlacesA = !!places.osm.points_of_interest[a.key];
    const hasPlacesB = !!places.osm.points_of_interest[b.key];

    // Kategorie z miejscami będą na początku
    if (hasPlacesA && !hasPlacesB) {
      return -1;
    } else if (!hasPlacesA && hasPlacesB) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="ShowData">
      <div className="showDataContainer">
        <div className="ShowDataPage">
          <div className="search-bar-container-show-data">
            <div>
              <Link to="/home">
                <img
                  src={'/images/15minuteLogoJPG.jpg'}
                  alt="Red Cross"
                  className="logo-home"
                  title={t('Back to home page')}
                />
              </Link>
            </div>
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
            <div className="language-select-container-show-data">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-select"
              >
                <option value="en">{t('English')}</option>
                <option value="pl">{t('Polish')}</option>
                <option value="de">{t('German')}</option>
                {/* Dodaj więcej opcji według potrzeb */}
              </select>
            </div>
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
                    <div
                      className="category-click"
                      onClick={() => handleCategoryLabelClick(category.key)}
                      title={t('Show more information')}
                    >
                      {places.osm.points_of_interest[category.key] ? (
                        <h3 className="green-category">{t(category.label)}</h3>
                      ) : (
                        <h3 className="red-category">{t(category.label)}</h3>
                      )}

                      {places.osm.points_of_interest[category.key] ? (
                        <div className="info-container">
                          {categoryVisibility[category.key] ? (
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/271/271239.png"
                              alt="Arrow Up"
                              className="centered-img-tick"
                            />
                          ) : (
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/32/32195.png"
                              alt="Arrow Down"
                              className="centered-img-tick"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>

                    {categoryVisibility[category.key] ? (
                      <>
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
                                  <div className="centerized name-style">
                                    {item.name}
                                    <br />
                                  </div>
                                )}
                                {item.name === 'unknown' && (
                                  <div className="centerized name-style">
                                    {category.label}
                                    <br />
                                  </div>
                                )}
                                {item.address.full && (
                                  <div className="centerized">
                                    {item.address.full}
                                    <br />
                                  </div>
                                )}
                                <div className="centerized">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/3272/3272603.png"
                                    alt="distance-icon"
                                    className="img-distance"
                                  />{' '}
                                  {item.distance === 0
                                    ? t('You are here')
                                    : item.distance < 1000
                                      ? `${item.distance.toFixed(0)}m`
                                      : `${(item.distance / 1000).toFixed(
                                          1,
                                        )}km`}
                                  <br />
                                </div>
                                {/*
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
                              */}
                                <div className="centerized">
                                  {item.tags['contact:instagram'] && (
                                    <a href={item.tags['contact:instagram']}>
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/4138/4138124.png"
                                        alt="Intsgram link"
                                        className="img-instagram"
                                      />
                                    </a>
                                  )}
                                  {item.tags['contact:facebook'] && (
                                    <a href={item.tags['contact:facebook']}>
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/5968/5968764.png"
                                        alt="Facebook link"
                                        className="img-facebook"
                                      />
                                    </a>
                                  )}
                                </div>
                              </li>
                            ),
                          )}
                        </ul>
                      </>
                    ) : null}
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
