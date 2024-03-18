import React from 'react';
import { SearchResult } from './SearchResult';
import '../styles/SearchResultsList.css';

export const SearchResultsList = ({ results, onResultClick, searchResultsListClassName, searchResultsClassName }) => {
  return (
    <div className={`results-list ${searchResultsListClassName}`}>
      {console.log(results)}
      {results.map((result) => {
        return (
          <SearchResult
            key={result}
            result={result}
            onResultClick={onResultClick}
            searchResultsClassName={searchResultsClassName}
          />
        );
      })}
    </div>
  );
};
