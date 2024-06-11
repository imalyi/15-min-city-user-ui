import React from 'react';
import { SearchResult } from './SearchResult';
import '../styles/SearchResultsList.css';
import { logger } from '../logger';

export const SearchResultsList = ({
  results,
  onResultClick,
  searchResultsListClassName,
  searchResultsClassName,
}) => {
  return (
    <div className={`results-list ${searchResultsListClassName}`}>
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