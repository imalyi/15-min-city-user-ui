import React from 'react';
import '../styles/SearchResult.css';

export const SearchResult = ({ result, onResultClick }) => {
  return (
    <div className="search-result" onClick={() => onResultClick(result)}>
      {result}
    </div>
  );
};