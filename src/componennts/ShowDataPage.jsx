import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShowDataPage.css'; // Dodaj import stylów
import Map from './Map';
import Footer from './Footer';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { UserLocationButton } from './UserLocationButton';
import showdata from '../data/showdata.json';
import ShowDataButton from './ShowDataButton';

function ShowDataPage() {
  const location = useLocation();
  const jsonData = location.state?.jsonData || {};
  const address = location.state?.address || 'Unknown Address';
  const aboutInfo = 'Information from Show-Adresses Component';
  const [view, setView] = useState('Data');
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(false);

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
    <div className="showDataContainer">
      <div className="ShowDataPage">
        <div className="search-bar-container-show-data">
          <UserLocationButton onLocationUpdate={handleUserLocationUpdate} />
          <div className="column-show-data search-bar-and-results-show-data results-container-show-data">
            <SearchBar setResults={setResults} input={input} setInput={handleSearchBarChange} />
            {results && results.length > 0 && !isResultClicked && (
              <SearchResultsList results={results} onResultClick={handleResultClick} />
            )}
          </div>
          <ShowDataButton jsonData={showdata} address={input} />
        </div>
        <button
          className={`toggleButton ${view === 'Map' ? 'mapButton' : 'dataButton'}`}
          onClick={() => setView(view === 'Data' ? 'Map' : 'Data')}
        >
          {view === 'Data' ? 'Show Map' : 'Show Data'}
        </button>
        {view === 'Data' && (
          <>
            <h2>{address}</h2>
            {Object.keys(jsonData).map((category) => (
              <div key={category} className="data-category">
                <h3>{category}</h3>
                <ul className="data-list">
                  {jsonData[category].map((item, index) => (
                    <li key={index} className="data-list-item">
                      Distance: {item.distance}, Gmaps URL:{' '}
                      <a href={item.gmaps_url}>{item.gmaps_url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
        {view === 'Map' && (
          <div className="map-container">
            <Map />
          </div>
        )}
      </div>
    </div>
      <div>
        <Footer additionalInfo={aboutInfo} />
      </div>
    </div>

  );
}

export default ShowDataPage;
