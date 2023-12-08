// Komponent Roles.jsx
import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import rolesData from '../data/roles.json';
import '../styles/Roles.css';

const Roles = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
    onSelectRole(selectedRole);
  };

  useEffect(() => {
    // Jeśli nie wybrano żadnej roli, domyślnie ustaw "without role"
    if (!selectedRole) {
      setSelectedRole('without role');
      onSelectRole('without role');
    }
  }, [onSelectRole, selectedRole]);

  return (
    <div className="roles-container">
      <h2 className="roles-header">Who Are You?</h2>
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
  );
};

export default Roles;
