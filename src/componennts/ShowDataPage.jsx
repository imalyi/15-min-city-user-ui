import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShowDataPage.css'; // Dodaj import stylów
import Map from './Map';

function ShowDataPage() {
  const location = useLocation();
  const jsonData = location.state?.jsonData || {};
  const address = location.state?.address || 'Unknown Address';

  const [view, setView] = useState('Data');

  return (
    <div className="showDataContainer">
      <div className="ShowDataPage">
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
  );
}

export default ShowDataPage;
