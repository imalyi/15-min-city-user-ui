import React from 'react';
import '../styles/SearchResult.css';

export const SearchResult = ({ result, onResultClick, searchResultsClassName }) => {
  return (
    <div className={`search-list ${searchResultsClassName}`} onClick={() => onResultClick(result)}>
      {console.log(result)}
      {result}
    </div>
  );
};
