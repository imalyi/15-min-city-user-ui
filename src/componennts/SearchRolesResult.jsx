import React from 'react';
import '../styles/SearchRolesResult.css';
import { logger } from '../logger';

export const SearchRolesResult = ({ result, onResultClick }) => {
  return (
    <div className="search-result" onClick={() => onResultClick(result)}>
      {result.name ? result.name : result}
    </div>
  );
};
