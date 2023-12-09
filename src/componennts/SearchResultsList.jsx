import React from 'react';
import { SearchResult } from './SearchResult';
import '../styles/SearchResultsList.css';

export const SearchResultsList = ({ results, onResultClick }) => {
  return (
    <div className="results-list">
      {console.log("ja tu")}
      {results.map((result) => {
        return <SearchResult key={result.id} result={result.address} onResultClick={onResultClick} />;
      })}
    </div>
  );
};