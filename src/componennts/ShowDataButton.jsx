import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/ShowDataButton.css"
import { FaSearch } from 'react-icons/fa';

const ShowDataButton = ({ jsonData, address, selectedRole }) => {
  return (
    <Link to="/show-addresses" state={{ jsonData, address, selectedRole }}>
      <button className="show-data-button">{<FaSearch id="search-icon" />}</button>
    </Link>
  );
};

export default ShowDataButton;
