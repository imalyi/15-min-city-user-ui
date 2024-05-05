import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../styles/SearchBar.css';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { ShowDataButton } from './ShowDataButton';
import { use } from 'i18next';
import { logger } from '../logger';
import { Icon } from '@iconify/react';


export const SearchBar = ({
  setResults,
  showDataRef,
  input,
  addresses,
  setInput,
  setIsResultClicked,
  onEnterPress,
  searchBarClassName,
  selectedPreferences,
  transformedPreferences,
  preferencesSearchData,
  ShowDataButtonCompare,
  handleCompareWindowOpen,
  setAlarm,
  alarm,
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
        const response = await fetch(
          `${api.APP_URL_USER_API}address/?name=${value}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }, // Zamień dane na format JSON
          },
        );
        if (response.ok) {
          const data = await response.json();
          const results = data.slice(0, 3);
          setResults(results);
        } else {
          console.error(
            'Error getting address from coordinatessss:',
            response.statusText,
          );
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.error('Error getting address from coordinates:', error);
        showServerErrorAlert();
      }
    },
    [setIsResultClicked, setResults],
  );

  const handleChange = (value) => {
    setInput(value);
    if (value === '') {
      setIsResultClicked(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onEnterPress(); // Wywołaj funkcję, którą przekazałeś jako prop (np. obsługę naciśnięcia przycisku ShowDataButton)
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
    <div className={`${alarm === '' ? '' : 'search-bar-with-alarm'}`}>
      <div className={`${searchBarClassName === 'compare-window-search-bar' ? searchBarClassName : 'input-wrapper ' + searchBarClassName}`}>
        <input
          placeholder={t('Enter address (street, city...)')}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button ref={buttonRef} style={{ display: 'none' }}></button>
        <ShowDataButton
          ref={showDataRef}
          address={input}
          addresses={addresses}
          selectedPreferences={selectedPreferences}
          transformedPreferences={transformedPreferences}
          preferencesSearchData={preferencesSearchData}
          ShowDataButtonCompare={ShowDataButtonCompare}
          handleCompareWindowOpen={handleCompareWindowOpen}
          setAlarm={setAlarm}
        />
      </div>
      <div>
        {alarm && <div> <Icon icon="material-symbols-light:error-outline" id="error-outline-button" /></div>}
      </div>
    </div>
  );
};
