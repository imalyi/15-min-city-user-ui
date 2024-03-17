import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import {Icon} from '@iconify/react';
import { motion, AnimatePresence } from "framer-motion"
import {RightSectionSlide} from "./anim.js"

function ShowDataPage() {
  const navigate = useNavigate();
  const [isMatchVisible, setIsMatchVisible] = useState(false);
  const [isMatchDetailsVisible, setisMatchDetailsVisible] = useState(false);

  const location = useLocation();
  const places = location.state?.places || {};
  console.log(places);
  const address = location.state?.address || 'Unknown Address';
  console.log(address);
  const addressId = location.state?.addressId || 'Unknown Address';
  console.log(addressId);
  const selectedPreferences = location.state?.selectedPreferences || [];
  console.log(selectedPreferences);

  const selectedCoordinates = [location.state?.places.location[1], location.state?.places.location[0]];
  const [results, setResults] = useState([]);
  const [input, setInput] = useState(address);
  const [addressIdShowPage, setAddressIdShowPage] = useState(addressId);
  const [isResultClicked, setIsResultClicked] = useState(true);
  const [selectedCoordinatesShowPage, setSelectedCoordinatesShowPage] =
    useState(selectedCoordinates);
  const [selectedPreferencesShowPage, setSelectedPreferencesShowPage] =
    useState(selectedPreferences);
  const buttonRef = useRef(null);
  console.log(selectedPreferencesShowPage);
  const [preferencesData, setPreferencesData] = useState([]);


  const [flyToLocation, setFlyToLocation] = useState(null);

  const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(true);

  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const [categoryVisibility, setCategoryVisibility] = useState({});



  const handlePreferencesData = (data) => {
    setPreferencesData(data)
  };
  console.log(preferencesData)

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
    setInput(result);
    setAddressIdShowPage(result);
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

  const handleToggleMatch = () => {
    setIsMatchVisible((prev) => !prev);
  };

  const handleToggleMatchDetails = () => {
    setisMatchDetailsVisible((prev) => !prev);
  };

  const handlePreferencesSelect = (preferences) => {
    setSelectedPreferencesShowPage(preferences);
  };

  const countVisibleCategories = () => {
    if (categoriesToShow.length === 0) {
      return {
        text: '',
        class: 'red-text',
      };
    }
    const visibleCategories = categoriesToShow.filter(category => {
      return Object.keys(places.points_of_interest).some(interestKey => {
        const interests = places.points_of_interest[interestKey];
        console.log(interestKey);
        return interests.hasOwnProperty(category.label);
      });
    });
    console.log(visibleCategories);
    const percentage =
      (visibleCategories.length / categoriesToShow.length) * 100;
    // Ustal klasę tekstu w zależności od procentu
    let textClass = '';

    if (percentage <= 30) {
      textClass = 'red-text';
    } else if (percentage > 30 && percentage < 50) {
      textClass = 'orange-text';
    } else if (percentage > 50 && percentage < 70) {
      textClass = 'yellow-text';
    } else if (percentage > 70 && percentage < 90) {
      textClass = 'light-green-text';
    } else if (percentage > 90) {
      textClass = 'green-text';
    }

    return {
      text: `${percentage.toFixed(0)}%`,
      class: textClass,
      percentage: percentage,
    };
  };



  const mainCategoriesToShow = Object.keys(places.points_of_interest);
  console.log(mainCategoriesToShow);

  const filteredPreferencesData = Object.keys(preferencesData).reduce((acc, key) => {
  // Filtruj preferencje w danej kategorii
  const filteredPreferences = preferencesData[key].filter(preference => {
    return selectedPreferences.some(selectedPreference => selectedPreference.name === preference.name);
  });
  
  // Jeśli istnieją jakieś pasujące preferencje, dodaj je do wynikowej tablicy
  if (filteredPreferences.length > 0) {
    acc[key] = filteredPreferences;
  }
  
  return acc;
  }, {});

  console.log(filteredPreferencesData);

  const calculatePercentageInCategory = (category) => {
    const allPreferencesInCategory = places.points_of_interest[category];
    
    const filteredPreferencesInCategory = filteredPreferencesData[category];
    
    const categories = Object.keys(allPreferencesInCategory);
  
    const numberOfCategories = categories.length;

    const filteredPreferencesCount = filteredPreferencesInCategory ? filteredPreferencesInCategory.length : 0;
    
    const percentage = (numberOfCategories / filteredPreferencesCount) * 100;
    console.log(filteredPreferencesCount)
    return `${percentage.toFixed(0)}%`;
  };

  const categoriesToShow = selectedPreferences.map((preference) => {
    const formattedPreferenceLabel = preference.name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      key: preference.name,
      label: formattedPreferenceLabel,
    };
  });

  console.log(categoriesToShow);
/*
  categoriesToShow.sort((a, b) => {
    const hasPlacesA = !!places.points_of_interest[a.key];
    const hasPlacesB = !!places.points_of_interest[b.key];

    // Kategorie z miejscami będą na początku
    if (hasPlacesA && !hasPlacesB) {
      return -1;
    } else if (!hasPlacesA && hasPlacesB) {
      return 1;
    }
    return 0;
  });
*/

  if (Object.keys(places).length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="ShowData">
      <div className="showDataContainer">
        <div className="ShowDataPage">
          <div className="search-bar-container-show-data">
            <div>
            <Link to="/">
              <button
                className="logo"
                title={t('Search Page')}
              >
              <img
                src={'/images/15min_logo.svg'}
                alt="Red Cross"
                className="centered-img-cross"
              />
              </button>
            </Link>
            </div>
            <div className='widthReportSection'>
              <div className='position'>
                <button
                  className={isMatchVisible ? "toggleReportSectionisMatchVisibleClass" : "toggleReportSection"}
                  title={t('Search Page')}
                  onClick={handleToggleMatch}
                >
                <label className={isMatchVisible ? "toggleReportSectionLabelisMatchVisibleClass" : "toggleReportSection-label"}>{t("See match")}</label>
                {isMatchVisible ? (                 
                  <IoIosArrowUp className="toggleReportSection-icon"/>
                ) : (
                  <IoIosArrowDown className="toggleReportSection-icon"/>
                )}
                </button>
                
                {isMatchVisible && (
                <div className='matchVidible'>
                  <div className='show-data-hr-place'>
                    <hr className='show-data-search-place-hr'/>
                  </div>
                  <div>
                    {(selectedPreferencesShowPage.length === 0) ? (
                      <label className='selectyourCriteria' style={{paddingBottom: '9vh'}}>{t("Select your criteria in the menu on the left to see a match")}</label>
                    ) : (
                      <div>
                      {isMatchDetailsVisible ? (                 
                        <div>
                          <div className='selectyourCriteria' ><div className='matchingName'>{t("Matching")} {countVisibleCategories().text}</div>
                            <div className='matchContainer'>
                              <div className='matchBackground'></div>
                              <div className='matchReactangle' style={{ width: `calc(${countVisibleCategories().percentage}%)`, height: "100%"}}></div>
                            </div>
                          </div>
                          <div className='show-data-hr-place'>
                            <hr className='show-data-search-place-hr'/>
                          </div>
                          {mainCategoriesToShow.map((category, index) => (
                            <div key={index} className='selectyourCriteria' ><div className='matchingName'>{category} {calculatePercentageInCategory(category)} </div>
                              <div className='matchContainer'>
                                <div className='matchBackground'></div>
                                <div className='matchReactangle' style={{ width: `calc(${calculatePercentageInCategory(category)})`}}></div>
                              </div>
                            </div>
                          ))}
                          <div className='toggle-match-details-div' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <div className="toggle-match-details" onClick={() => handleToggleMatchDetails()}>{t("Collapse details")}</div>
                          </div>
                        </div>  
                      ) : (
                        <div>
                          <div className='selectyourCriteria' ><div className='matchingName'>{t("Matching")} {countVisibleCategories().text}</div>
                            <div className='matchContainer'>
                              <div className='matchBackground'></div>
                              <div className='matchReactangle' style={{ width: `calc(${countVisibleCategories().percentage}%)`, height: "100%",   backgroundColor: "#F8718A"}}></div>
                            </div>
                          </div>
                          <div className='toggle-match-details-div' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <div className="toggle-match-details" onClick={() => handleToggleMatchDetails()}>{t("Expand on details")}</div>
                          </div>
                        </div>  
                      )}   
                      </div>       
                    )}
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
          <div className="show-data-map">
              <div className="left-section">
                <div>
                  <Roles
                    onSelectPreferences={handlePreferencesSelect}
                    selectedPreferencesShowPage={selectedPreferencesShowPage}
                    toggleRoleSVisible={handleToggleLeftSection}
                    isLeftSectionVisible={isLeftSectionVisible}
                    setPreferencedDataShowPage={handlePreferencesData}
                  />
                </div>
              </div>

            <div
              className={`right-section map-container ${
                isLeftSectionVisible ? '' : 'right-section-center'
              }`}
            >
            <div className="column-show-data search-bar-and-results-show-data results-container-show-data">
            <motion.div
              variants={RightSectionSlide}
              animate="enter"
              exit="exit"
              initial="initial"
            >
              <SearchBar
              setResults={setResults}
              showDataRef={buttonRef}
              input={input}
              addressId={addressId}
              setInput={handleSearchBarChange}
              setIsResultClicked={setIsResultClicked}
              onEnterPress={handleEnterPress}
              searchBarClassName="show-data-page-search-bar"
              selectedPreferences={selectedPreferencesShowPage}
              />
            </motion.div>
              {results && results.length > 0 && !isResultClicked && (
                <SearchResultsList
                  results={results}
                  onResultClick={handleResultClick}
                  searchResultsListClassName="show-data-page-search-result-list"
                  searchResultsClassName="show-data-page-search-list"
                />
              )}

            </div>
              <Map
                places={places.points_of_interest}
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
      <Footer />
    </div>
  );
}

export default ShowDataPage;
{/*
                <div
                  className={`category-counter ${
                    countVisibleCategories().class
                  }`}
                >
                  {countVisibleCategories().text}
                </div>
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
                              */}