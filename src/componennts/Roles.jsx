import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import rolesData from '../data/roles.json';
import preferencesData from '../data/preferences.json';
import '../styles/Roles.css';

const Roles = ({
  onSelectRole,
  onSelectPreferences,
  selectedRoleFromShowPage,
  selectedPreferencesShowPage,
}) => {
  const [selectedRole, setSelectedRole] = useState(selectedRoleFromShowPage);
  const [selectedPreferences, setSetectedPreferences] = useState(
    selectedPreferencesShowPage,
  );

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
    onSelectRole(selectedRole);
  };

  const handlePreferenceChange = (event) => {
    const preference = event.target.value;
    const updatedPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter((item) => item !== preference)
      : [...selectedPreferences, preference];
    setSetectedPreferences(updatedPreferences);
    onSelectPreferences(updatedPreferences);
  };

  useEffect(() => {
    // Jeśli nie wybrano żadnej roli, domyślnie ustaw "without role"
    if (selectedRole === 'without role') {
      setSelectedRole('without role');
      onSelectRole('without role');
    } else {
      setSelectedRole(selectedRole);
      onSelectRole(selectedRole);
    }
  }, [onSelectRole, selectedRole]);

  return (
    <div className="roles-container">
      <div className="roles-section">
        <div className="roles-column">
          <h3 className="roles-header centered-header">Choose Your Role</h3>
          <FormGroup>
            {/* Dodaj nowy checkbox "without role" */}
            <FormControlLabel
              control={
                <Checkbox
                  value="without role"
                  checked={selectedRole === 'without role'}
                  onChange={handleRoleChange}
                  className="role-checkbox"
                />
              }
              className="role-option"
              label="Without Role"
            />

            {rolesData.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    value={role.role}
                    checked={selectedRole === role.role}
                    onChange={handleRoleChange}
                    className="role-checkbox"
                  />
                }
                className="role-option"
                label={role.role}
              />
            ))}
          </FormGroup>
        </div>
        <div className="preferences-column">
          <h3 className="roles-header centered-header">
            Choose Your Preferences
          </h3>
          <FormGroup>
            {preferencesData.map((preference) => (
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
                label={preference.preference}
              />
            ))}
          </FormGroup>
        </div>
      </div>
    </div>
  );
};

export default Roles;
