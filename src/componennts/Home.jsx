// Komponent Home.jsx
import React, { useState } from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { UserLocationButton } from './UserLocationButton';
import showdata from '../data/showdata.json';
import ShowDataButton from './ShowDataButton';
import HowItWorks from './HowItWorks';

function Home() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);
  const aboutInfo = 'Information from Home Component';
  const howItWorksText = '***Description of page functions***';

  const handleResultClick = (result) => {
    setInput(result);
    setIsResultClicked(true);
  };

  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  const handleUserLocationUpdate = (latitude, longitude) => {
    setInput(`${latitude} ${longitude}`);
  };

  return (
    <div>
      <div className="search-bar-container">
        <UserLocationButton onLocationUpdate={handleUserLocationUpdate} />
        <div className="column search-bar-and-results results-container">
          <SearchBar setResults={setResults} input={input} setInput={handleSearchBarChange} />
          {results && results.length > 0 && !isResultClicked && (
            <SearchResultsList results={results} onResultClick={handleResultClick} />
          )}
        </div>
        <ShowDataButton jsonData={showdata} address={input} />
      </div>
      <HowItWorks howItWorksText={howItWorksText} />
      <Footer additionalInfo={aboutInfo} />
    </div>
  );
}

export default Home;
