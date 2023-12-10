import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/ShowDataButton.css"
import { FaSearch } from 'react-icons/fa';

export const ShowDataButton = React.forwardRef(({ jsonData, address, selectedRole }, ref) => {
  return (
    <Link to="/show-addresses" state={{ jsonData, address, selectedRole }}>
      <button ref={ref} className="show-data-button">
        {<FaSearch id="search-icon" />}
      </button>
    </Link>
  );
});

export default ShowDataButton;
