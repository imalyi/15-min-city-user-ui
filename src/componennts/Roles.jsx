import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import '../styles/Roles.css';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { SearchRolesBar } from './SearchRolesBar';
import { SearchRolesResultsList } from './SearchRolesResultsList';
import {Icon} from '@iconify/react';
import { motion, AnimatePresence } from "framer-motion"
import {LeftSectionSlide, LeftSectionSlideHide} from "./anim.js"

const Roles = ({ onSelectPreferences, selectedPreferencesShowPage, toggleRoleSVisible, isLeftSectionVisible, setPreferencedDataShowPage, setPreferencesSearchDataShowPage, handleSearch }) => {
  const { t } = useTranslation();
  const [isShowDataPage, setIsShowDataPage] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState(
    selectedPreferencesShowPage,
  );
  const [preferencesData, setPreferencesData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [customAddress, setCustomAddress] = useState([]);
  const [customObject, setCustomObject] = useState([]);
  const [input, setInput] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const [preferencesSearchData, setPreferencesSearchData] = useState([]);

  const handleRemoveAllPreferences = () => {
    setPreferencesSearchData([]);
    setSelectedPreferences([]);
    onSelectPreferences([]);
    setPreferencesSearchDataShowPage([]);
    setTimeout(handleSearch(), 50);

  }

  const handleRemovePreference = (preferenceIndex) => {
    const updatedPreferences = [...preferencesSearchData];
    updatedPreferences.splice(preferenceIndex, 1);
    setPreferencesSearchData(updatedPreferences);
    setPreferencesSearchDataShowPage(updatedPreferences);
    setTimeout(handleSearch(), 50);

  };

  const handleResultClick = (result) => {
    setInput("");
    setIsResultClicked(true);
    console.log(result);
  
    // Sprawdzenie, czy result już istnieje w preferencesSearchData
    const resultExists = preferencesSearchData.some(item => {
      if (typeof item === 'object' && typeof result === 'object') {
        return item.name === result.name;
      } else {
        return item === result;
      }
    });
  
    if (!resultExists) {
      // Jeśli result nie istnieje, dodaj go do preferencesSearchData
      setPreferencesSearchData([...preferencesSearchData, result]);
      setPreferencesSearchDataShowPage([...preferencesSearchData, result]);
      setTimeout(handleSearch(), 50);
      console.log(preferencesSearchData);
    } else {
      console.log("Result already exists in preferencesSearchData");
    }

  };
  

  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  useEffect(() => {
    // Sprawdzanie, czy obecna ścieżka to /showData
    setIsShowDataPage(window.location.pathname === '/show-addresses');
  }, []);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`${api.APP_URL_USER_API}categories/`);
        const data = await response.json();
        // Assuming the data structure is an array with a single object
        setPreferencesData(data);
        setPreferencedDataShowPage(data);
      } catch (error) {
        console.error('Error fetching preferences data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };

    // Sprawdź szerokość ekranu przy załadowaniu komponentu
    checkScreenWidth();

    // Dodaj nasłuchiwanie na zmiany szerokości ekranu
    window.addEventListener('resize', checkScreenWidth);

    // Usuń nasłuchiwanie przy odmontowywaniu komponentu
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const handlePreferenceChange = (event) => {
    const preferenceName = event.target.name;
    const updatedPreferences = selectedPreferences.some(
      (preference) => preference.name === preferenceName,
    )
      ? selectedPreferences.filter((item) => item.name !== preferenceName)
      : [...selectedPreferences, {name: preferenceName }];
    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
    setTimeout(handleSearch(), 50);

  };

  const handleCategoryToggle = (categoryName) => {
    const allPreferencesInCategory = preferencesData[categoryName].map(
      (preference) => ({name: preference.name }),
    );
    const categoryIsSelected = allPreferencesInCategory.every((preference) =>
      selectedPreferences.some((p) => p.name === preference.name),
    );

    const updatedPreferences = categoryIsSelected
      ? selectedPreferences.filter(
          (item) => !allPreferencesInCategory.some((p) => p.name === item.name),
        )
      : [...selectedPreferences, ...allPreferencesInCategory];

    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
    setTimeout(handleSearch(), 50);

  };


  
  const handleSelectAllPreferences = () => {
    const allPreferences = Object.values(preferencesData).reduce(
      (all, category) => {
        return all.concat(
          category.map((preference) => ({
            id: preference.name,
            name: preference.name,
          })),
        );
      },
      [],
    );

    const allSelected = allPreferences.every((preference) =>
      selectedPreferences.some((p) => p.name === preference.name),
    );

    const updatedPreferences = allSelected
      ? selectedPreferences.filter(
          (item) => !allPreferences.some((p) => p.name === item.name),
        )
      : [...allPreferences];

    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
  };


  const toggleCategoryExpansion = (categoryName) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter((cat) => cat !== categoryName),
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
    setTimeout(handleSearch(), 50);
    
  };

  return (

    <div>
    <AnimatePresence mode='wait'>

    {isLeftSectionVisible && (
      <motion.div
      variants={LeftSectionSlide}
      animate="enter"
      exit="exit"
      initial="initial"
      >
      <div  style={{position: "absolute", width: "100%"}}>
      <div>
        <SearchRolesBar
          setCustomAddress={setCustomAddress}
          setCustomObject={setCustomObject}
          input={input}
          setInput={handleSearchBarChange}
          setIsResultClicked={setIsResultClicked}
          searchBarClassName="roles-search-bar"
        />
        {customAddress && customObject && customAddress.length > 0 && customObject.length > 0 && !isResultClicked && (
          <SearchRolesResultsList
            customAddress={customAddress}
            customObject={customObject}
            onResultClick={handleResultClick}
            searchResultsListClassName="roles-search-result-list"
          />
        )}
      </div>
      <div className='hr-place'>
        <hr className='search-place-hr'/>
      </div>
      <div className={`roles-container ${isShowDataPage ? '' : 'homeStyle'}`}>
        <div className="centered-category-header">
          <div className="preferences-column">
            {Object.keys(preferencesData).map((categoryName) => (
              <div key={categoryName} className="category-container">
                <div className="category-header">
                <FormControlLabel
                    control={
                      <div className="custom-checkbox">
                        <Checkbox
                          checked={preferencesData[categoryName].every(
                            (preference) =>
                              selectedPreferences.some(
                                (p) => p.name === preference.name,
                              ),
                          )}
                          onChange={() => handleCategoryToggle(categoryName)}
                        />
                      </div>
                    }
                    label={<span className="category-label">{t(categoryName)}</span>}
                  />
                <div className="expand-button-wrapper">
                  <button
                    variant="outlined"
                    size="small"
                    onClick={() => toggleCategoryExpansion(categoryName)}
                    className="expand-button"
                  >
                    {expandedCategories.includes(categoryName) ? (
                      <IoIosArrowUp className='expand-icon'/>
                    ) : (
                      <IoIosArrowDown className='expand-icon'/>
                    )}
                  </button>
                </div>
                </div>
                {expandedCategories.includes(categoryName) && (
                  <div className="preferences-checkbox">
                    {preferencesData[categoryName].map((preference) => (
                      <FormControlLabel
                        key={preference.name}
                        control={
                          <Checkbox
                            value={preference.name}
                            name={preference.name}
                            checked={selectedPreferences.some(
                              (p) => p.name === preference.name,
                            )}
                            onChange={handlePreferenceChange}
                            className="role-checkbox"
                          />
                        }
                        className="role-option"
                        label={<span className="preferences-label">{t(preference.name)}</span>}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <label className="filters-label">{t("Your filters")}</label>

      <div>
        {preferencesSearchData.map((preference, index) => (
          <div key={index} className="selected-search-preferences">
            <div className="selected-search-preference">
              <span className="selected-preference-label">{t(preference.name ? preference.name : preference)}</span>
              <Icon icon="material-symbols-light:close" className="close-icon" onClick={() => handleRemovePreference(index)}/> 
            </div>
          </div>
        ))}
        </div>
      </div>
      <div className='hr-place'>
        <hr className='search-place-hr'/>
      </div>
      <div className="delete-all">
        <label className="clear-all" onClick={() => handleRemoveAllPreferences()}>{t("Clear all")}</label>
        <div className="toggle-left-section-wrapper">
          <Icon icon="mdi-light:arrow-left" className="toggle-left-section-icon"/>
          <label className="toggle-left-section" onClick={() => toggleRoleSVisible()} >{t("Hide")}</label>
        </div>
      </div>
      </div>
      </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
      {!isLeftSectionVisible && (
      <motion.div
        variants={LeftSectionSlideHide}
        animate="enter"
        exit="exit"
        initial="initial"
      >
        
      <div className="toggle-left-section-wrapper-show-data left-section-center" style={{position: "absolute"}}>
        <div className='toggle-left-section-div'onClick={() => toggleRoleSVisible()}>
          <Icon icon="mdi-light:arrow-right" className="toggle-left-section-icon-show-data"/>
        </div>
      </div>
      </motion.div>
      )}
      </AnimatePresence>
    </div>

  );
};

export default Roles;
