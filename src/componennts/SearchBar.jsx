import React from 'react';
import addresses from '../data/addresses.json';
import '../styles/SearchBar.css';

export const SearchBar = ({ setResults, input, setInput }) => {
  const fetchData = (value) => {
    const results = addresses.filter((address) => {
      return (
        value &&
        address &&
        address.address &&
        address.address.toLowerCase().includes(value.toLowerCase())
      );
    });
    setResults(results);
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
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