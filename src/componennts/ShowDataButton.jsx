import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/ShowDataButton.css"
import { FaSearch } from 'react-icons/fa';

export const ShowDataButton = React.forwardRef(({ jsonData, address, selectedRole, selectedPreferences }, ref) => {
  return (
    <Link to="/show-addresses" state={{ jsonData, address, selectedRole, selectedPreferences }}>
      <button ref={ref} className="show-data-button">
        {<FaSearch id="search-icon" />}
      </button>
    </Link>
  );
});

export default ShowDataButton;
