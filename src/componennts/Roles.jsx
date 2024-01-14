import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import '../styles/Roles.css';
import { useTranslation } from 'react-i18next';
import api from '../config';

const Roles = ({ onSelectPreferences, selectedPreferencesShowPage }) => {
  const { t } = useTranslation();
  const [isShowDataPage, setIsShowDataPage] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState(
    selectedPreferencesShowPage,
  );
  const [preferencesData, setPreferencesData] = useState([]);
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

  const handlePreferenceChange = (event) => {
    const preference = event.target.value;
    const updatedPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter((item) => item !== preference)
      : [...selectedPreferences, preference];
    setSelectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
  };

  return (
    <div className={`roles-container ${isShowDataPage ? '' : 'homeStyle'}`}>
      <div>
        <div>
          <h3 className="centered-header">{t('Choose Your Preferences')}</h3>
        </div>
        <div className="preferences-column">
          {Object.keys(preferencesData).map((categoryName) => (
            <div key={categoryName}>
              <h4 className="centered-category-header">{t(categoryName)}</h4>
              <div className="preferences-checkbox">
                {preferencesData[categoryName].map((preference) => (
                  <FormControlLabel
                    key={preference.id}
                    control={
                      <Checkbox
                        value={preference.name}
                        checked={selectedPreferences.includes(preference.name)}
                        onChange={handlePreferenceChange}
                        className="role-checkbox"
                      />
                    }
                    className="role-option"
                    label={t(preference.name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roles;
