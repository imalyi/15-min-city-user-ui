import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import '../styles/Roles.css';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { SearchRolesBar } from './SearchRolesBar';
import { SearchRolesResultsList } from './SearchRolesResultsList';

const Roles = ({ onSelectPreferences, selectedPreferencesShowPage }) => {
  const { t } = useTranslation();
  const [isShowDataPage, setIsShowDataPage] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState(
    selectedPreferencesShowPage,
  );
  const [preferencesData, setPreferencesData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const [preferencesSearchData, setPreferencesSearchData] = useState([]);

  const handleResultClick = (result) => {
    setInput("");
    setIsResultClicked(true);
    setPreferencesSearchData([...preferencesSearchData, result]);
    console.log(preferencesSearchData)
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
        setPreferencesData(data[0]);
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
    const preferenceId = parseInt(event.target.value, 10);
    const preferenceName = event.target.name;
    const updatedPreferences = selectedPreferences.some(
      (preference) => preference.id === preferenceId,
    )
      ? selectedPreferences.filter((item) => item.id !== preferenceId)
      : [...selectedPreferences, { id: preferenceId, name: preferenceName }];
    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
  };

  const handleCategoryToggle = (categoryName) => {
    const allPreferencesInCategory = preferencesData[categoryName].map(
      (preference) => ({ id: preference.id, name: preference.name }),
    );
    const categoryIsSelected = allPreferencesInCategory.every((preference) =>
      selectedPreferences.some((p) => p.id === preference.id),
    );

    const updatedPreferences = categoryIsSelected
      ? selectedPreferences.filter(
          (item) => !allPreferencesInCategory.some((p) => p.id === item.id),
        )
      : [...selectedPreferences, ...allPreferencesInCategory];

    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
  };

  const handleSelectAllPreferences = () => {
    const allPreferences = Object.values(preferencesData).reduce(
      (all, category) => {
        return all.concat(
          category.map((preference) => ({
            id: preference.id,
            name: preference.name,
          })),
        );
      },
      [],
    );

    const allSelected = allPreferences.every((preference) =>
      selectedPreferences.some((p) => p.id === preference.id),
    );

    const updatedPreferences = allSelected
      ? selectedPreferences.filter(
          (item) => !allPreferences.some((p) => p.id === item.id),
        )
      : [...allPreferences];

    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
    console.log(selectedPreferences);
  };

  const totalPreferencesCount = Object.values(preferencesData).reduce(
    (total, category) => total + category.length,
    0,
  );

  const toggleCategoryExpansion = (categoryName) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter((cat) => cat !== categoryName),
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  return (
    <div>
      <div>
      <SearchRolesBar
      setResults={setResults}
      input={input}
      setInput={handleSearchBarChange}
      setIsResultClicked={setIsResultClicked}
      searchBarClassName="roles-search-bar"
      />
      {results && results.length > 0 && !isResultClicked && (
        <SearchRolesResultsList
          results={results}
          onResultClick={handleResultClick}
          searchResultsListClassName="show-data-page-search-result-list"
        />
      )}
      </div>
    <div className={`roles-container ${isShowDataPage ? '' : 'homeStyle'}`}>
      <div className="centered-category-header">


        <div className="preferences-column">
          {Object.keys(preferencesData).map((categoryName) => (
            <div
              key={categoryName}
              className={`${isSmallScreen ? 'expandable' : ''} ${
                expandedCategories.includes(categoryName)
                  ? 'expanded'
                  : 'collapsed'
              }`}
            >
              <div className="centered-category">
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferencesData[categoryName].every(
                          (preference) =>
                            selectedPreferences.some(
                              (p) => p.id === preference.id,
                            ),
                        )}
                        onChange={() => handleCategoryToggle(categoryName)}
                      />
                    }
                    label={
                      <span style={{ fontSize: '17px' }}>
                        {t(categoryName)}
                      </span>
                    }
                  />
                </div>
                {isSmallScreen && (
                  <button
                    className="toggle-button-expanded"
                    onClick={() => toggleCategoryExpansion(categoryName)}
                  >
                    {expandedCategories.includes(categoryName) ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>
                )}
              </div>
              <div
                className={`preferences-checkbox ${
                  isSmallScreen ? '' : 'expanded'
                }`}
              >
                {preferencesData[categoryName].map((preference) => (
                  <FormControlLabel
                    key={preference.id}
                    control={
                      <Checkbox
                        value={preference.id}
                        name={preference.name}
                        checked={selectedPreferences.some(
                          (p) => p.id === preference.id,
                        )}
                        onChange={handlePreferenceChange}
                        className="role-checkbox"
                      />
                    }
                    className="role-option"
                    label={
                      <span style={{ fontSize: '14px' }}>
                        {t(preference.name)}
                      </span>
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Roles;
