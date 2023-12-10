import React from 'react';
import '../styles/SearchBar.css';

export const SearchBar = ({
  setResults,
  input,
  setInput,
  setIsResultClicked,
}) => {
  const fetchData = async (value) => {
    if (value === '') {
      setIsResultClicked(true);
      return;
    }
    try {
      const response = await fetch(
        `https://15minuserapi.1213213.xyz/address/?name=${value}`,
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
        setResults(results);
      } else {
        console.error(
          'Error getting address from coordinates:',
          response.statusText,
        );
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      throw error;
    }
  };

  const handleChange = (value) => {
    setInput(value);
    if (value >= input || value === '') {
      fetchData(value);
    }
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
