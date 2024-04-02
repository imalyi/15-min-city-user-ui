import React from 'react';
import '../styles/SearchResult.css';
import { logger } from '../logger';

export const SearchResult = ({ result, onResultClick, searchResultsClassName }) => {
  return (
    <div className={`search-list ${searchResultsClassName}`} onClick={() => onResultClick(result)}>
      {logger.log(result)}
      {result}
    </div>
  );
};
