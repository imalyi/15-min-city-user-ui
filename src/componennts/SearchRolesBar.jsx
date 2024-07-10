import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../styles/SearchRolesBar.css';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';
import { logger } from '../logger';
import { ObjectFetch } from './api.jsx';

export const SearchRolesBar = ({
  setCustomAddress,
  setCustomObject,
  input,
  setInput,
  setIsResultClicked,
  onEnterPress,
  searchBarClassName,
}) => {
  const { t } = useTranslation();
  const [debouncedValue, setDebouncedValue] = useState(input);
  const delay = 500; // Ustaw opóźnienie (w milisekundach) zależnie od Twoich preferencji
  const fetchTimeoutRef = useRef(null);

  const showServerErrorAlert = () => {
    alert(
      'Oops! Something went wrong with our server. Please try using Search Bar again later. We apologize for the inconvenience.',
    );
  };

  const fetchData = useCallback(
    async (value) => {
      if (value === '') {
        setIsResultClicked(true);
        return;
      }
      try {
          const data = await ObjectFetch(value, api.APP_URL_USER_API)
          setCustomAddress(data.addresses);
          setCustomObject(data.objects);
      } catch (error) {
        console.error('Error getting address from coordinates:', error);
      }
    },
    [setIsResultClicked, setCustomAddress, setCustomObject],
  );

  const handleChange = (value) => {
    setInput(value);
    if (value === '') {
      setIsResultClicked(true);
    }
  };

  const buttonRef = useRef(null); // Dodaj ref do przycisku

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(input);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [input, delay]);

  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Po upływie delay, wywołaj fetchData z ostatnią wprowadzoną wartością
    fetchTimeoutRef.current = setTimeout(() => {
      fetchData(debouncedValue);
    }, delay);

    // Opcjonalnie, aby wyczyścić timeout, gdy komponent jest odmontowywany lub gdy debouncedValue ulegnie zmianie
    return () => {
      clearTimeout(fetchTimeoutRef.current);
    };
  }, [debouncedValue, fetchData, delay]);

  return (
    <div className={`input-wrapper ${searchBarClassName}`}>
      <input
        placeholder={t('Search for an object by name...')}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      <button ref={buttonRef} style={{ display: 'none' }}></button>
      <div className="show-data-button-roles">
        {<Icon icon="carbon:search" id="search-icon" />}
      </div>
    </div>
  );
};
