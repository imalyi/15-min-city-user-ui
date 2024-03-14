import React from 'react';
import '../styles/SearchResult.css';

export const SearchResult = ({ result, onResultClick, searchResultsClassName }) => {
  return (
    <div className={`home-search-list ${searchResultsClassName}`} onClick={() => onResultClick(result)}>
      {result}
    </div>
  );
};
