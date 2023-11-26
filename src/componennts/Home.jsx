import React, { useState } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { UserLocationButton } from './UserLocationButton';

function Home() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const aboutInfo = 'Information from About Component';

  const handleResultClick = (result) => {
    setInput(result);
    setIsResultClicked(true);
  };

  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  const handleUserLocationClick = () => {
    // Tutaj możesz dodać logikę do pobierania lokalizacji użytkownika
    // W tym przykładzie ustawiam przykładowy adres
    const userLocation = 'Your User Location';
    setInput(userLocation);
  };

  return (
    <div className="search-bar-container">
      <UserLocationButton onClick={handleUserLocationClick} />
      <SearchBar setResults={setResults} input={input} setInput={handleSearchBarChange} />
      {results && results.length > 0 && !isResultClicked && (
        <SearchResultsList results={results} onResultClick={handleResultClick} />
      )}
      <Footer additionalInfo={aboutInfo} />
    </div>
  );
}

export default Home;
