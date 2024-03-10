import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../styles/SearchRolesBar.css';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';

export const SearchRolesBar = ({
    setResults, input, setInput, setIsResultClicked, onEnterPress, searchBarClassName
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
      console.log('przed response');
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
          console.log(data);
          const results = data;
          //setResults(results);
          setResults(['McDonalds', 'KFC', "Burger King", "Pizza Hut", "Subway", "Starbucks", "Costa Coffee", "Pret A Manger", "Greggs", "Nando's", "Wagamama", "Yo! Sushi", "Wimpy", "Taco Bell", "Domino's Pizza", "Papa John's Pizza", "PizzaExpress", "Zizzi", "ASK Italian", "Bella Italia", "Cafe Rouge", "Carluccio's", "Giraffe", "Las Iguanas", "TGI Fridays", "Chiquito", "Frankie & Benny's", "Harvester", "Toby Carvery", "Beefeater", "Brewers Fayre", "Hungry Horse", "Marston's Inns and Taverns", "Sizzling Pubs", "Stonehouse Pizza & Carvery", "Vintage Inns", "All Bar One", "Browns", "Ember Inns", "Miller & Carter", "Nicholson's", "O'Neill's", "Owens", "Sizzling Pubs", "Toby Carvery", "Vintage Inns", "Zizzi", "ASK Italian", "Bella Italia", "Cafe Rouge", "Carluccio's", "Giraffe", "Las Iguanas", "TGI Fridays", "Chiquito", "Frankie & Benny's", "Harvester", "Toby Carvery", "Beefeater", "Brewers Fayre", "Hungry Horse", "Marston's Inns and Taverns", "Sizzling Pubs", "Stonehouse Pizza & Carvery", "Vintage Inns", "All Bar One", "Browns", "Ember Inns", "Miller & Carter", "Nicholson's", "O'Neill's", "Owens", "Sizzling Pubs", "Toby Carvery", "Vintage Inns", "Zizzi", "ASK Italian", "Bella Italia", "Cafe Rouge", "Carluccio's", "Giraffe", "Las Iguanas", "TGI Fridays", "Chiquito", "Frankie & Benny's", "Harvester", "Toby Carvery", "Beefeater", "Brewers Fayre", "Hungry Horse", "Marston's Inns and Taverns", "Sizzling Pubs", "Stonehouse Pizza &"])
        } else {
          console.error(
            'Error getting address from coordinates:',
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
      <button
        className="show-data-button"
      >
        {<Icon icon="carbon:search" id='search-icon'/>}
      </button>
    </div>
  );
};