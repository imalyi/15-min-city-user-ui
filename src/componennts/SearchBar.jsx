import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../styles/SearchBar.css';

export const SearchBar = ({ setResults, input, setInput, setIsResultClicked, onEnterPress }) => {

  const [debouncedValue, setDebouncedValue] = useState(input);
  const delay = 500; // Ustaw opóźnienie (w milisekundach) zależnie od Twoich preferencji
  const fetchTimeoutRef = useRef(null);

  const fetchData = useCallback(async (value) => {
    if (value==="") {
      setIsResultClicked(true)
      return 
    }
    console.log("przed response")
    try {
      const response = await fetch(`https://15minuserapi.1213213.xyz/address/?name=${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, // Zamień dane na format JSON
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const results = data
        setResults(results);
      } else {
        console.error('Error getting address from coordinates:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      throw error;
    }
  }, [setIsResultClicked, setResults]);

  const handleChange = (value) => {
    setInput(value);
    if (value==="") {
      setIsResultClicked(true)
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
    <div className="input-wrapper">
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button ref={buttonRef} style={{ display: 'none' }}></button>
    </div>
  );
};
