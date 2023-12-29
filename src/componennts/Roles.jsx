import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import preferencesData from '../data/preferences.json';
import '../styles/Roles.css';
import { useTranslation } from 'react-i18next';

const Roles = ({ onSelectPreferences, selectedPreferencesShowPage }) => {
  const { t } = useTranslation();

  const [isShowDataPage, setIsShowDataPage] = useState(false);

  useEffect(() => {
    // Sprawdzanie, czy obecna ścieżka to /showData
    setIsShowDataPage(window.location.pathname === '/show-addresses');
  }, []);

  const [selectedPreferences, setSelectedPreferences] = useState(
    selectedPreferencesShowPage,
  );

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
          {preferencesData.map((category) => (
            <div key={category.category_name}>
              <h4 className="centered-category-header">
                {t(category.category_name)}
              </h4>
              <div className="preferences-checkbox">
                {category.places.map((preference) => (
                  <FormControlLabel
                    key={preference.id}
                    control={
                      <Checkbox
                        value={preference.preference}
                        checked={selectedPreferences.includes(
                          preference.preference,
                        )}
                        onChange={handlePreferenceChange}
                        className="role-checkbox"
                      />
                    }
                    className="role-option"
                    label={t(preference.web_preference)}
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
