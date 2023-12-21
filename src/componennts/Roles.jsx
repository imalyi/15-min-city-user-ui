import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import preferencesData from '../data/preferences.json';
import '../styles/Roles.css';

const Roles = ({ onSelectPreferences, selectedPreferencesShowPage }) => {
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
    <div className="roles-container">
      <div>
        <div>
          <h3 className="centered-header">Choose Your Preferences</h3>
        </div>
        <div className="preferences-column">
          {preferencesData.map((preference) => (
            <FormControlLabel
              key={preference.id}
              control={
                <Checkbox
                  value={preference.preference}
                  checked={selectedPreferences.includes(preference.preference)}
                  onChange={handlePreferenceChange}
                  className="role-checkbox"
                />
              }
              className="role-option"
              label={preference.web_preference}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roles;
