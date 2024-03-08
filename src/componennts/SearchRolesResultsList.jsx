import React from 'react';
import { SearchRolesResult } from './SearchRolesResult';
import '../styles/SearchRolesResultsList.css';

export const SearchRolesResultsList = ({ results, onResultClick, searchResultsListClassName }) => {
  return (
    <div className={`results-list ${searchResultsListClassName}`}>
      {console.log(results)}
      {results.map((result) => {
        return (
          <SearchRolesResult
            key={result}
            result={result}
            onResultClick={onResultClick}
          />
        );
      })}
    </div>
  );
};
