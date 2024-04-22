import React from 'react';
import { SearchRolesResult } from './SearchRolesResult';
import '../styles/SearchRolesResultsList.css';
import { logger } from '../logger';

export const SearchRolesResultsList = ({
  customAddress,
  customObject,
  onResultClick,
  searchResultsListClassName,
}) => {
  return (
    <div className={`roles-search-result-list ${searchResultsListClassName}`}>
      {logger.log(customAddress)}
      {customObject.map((object) => {
        return (
          <SearchRolesResult
            key={object}
            result={object}
            onResultClick={onResultClick}
          />
        );
      })}
      {customAddress.map((address) => {
        return (
          <SearchRolesResult
            key={address}
            result={address}
            onResultClick={onResultClick}
          />
        );
      })}
    </div>
  );
};
