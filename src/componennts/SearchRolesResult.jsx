import React from 'react';
import '../styles/SearchRolesResult.css';

export const SearchRolesResult = ({ result, onResultClick }) => {
  return (
    <div className="search-result" onClick={() => onResultClick(result)}>
      {result.name ? result.name : result}
    </div>
  );
};