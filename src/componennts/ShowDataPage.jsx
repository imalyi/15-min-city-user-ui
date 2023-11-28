import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShowDataPage.css'; // Dodaj import stylów

function ShowDataPage() {
    const location = useLocation();
    console.log(location)
    const jsonData = location.state?.jsonData || {};
    const address = location.state?.address || 'Unknown Address';
  
    return (
      <div className="ShowDataPage">
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
    </div>
  );
}

export default ShowDataPage;
