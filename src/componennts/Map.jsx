import React from 'react';
import GoogleMapReact from 'google-map-react';
import '../styles/Map.css';
import Markers from './Markers';

const Map = ({ jsonData, categoriesToShow }) => {
  const coordinates = { lat: 54.35, lng: 18.63 };

  return (
    <div style={{height: '80vh', width: '100%'}}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCoR0IBs5iHPFGyq3Q8DsuBRZZjziBSVQg'}}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={12}
        margin={[50, 50, 50, 50]}
        options={''}
        onChange={''}
        onChildClick={''}
        >
        {categoriesToShow.map((category) =>
          jsonData[category]?.map((item, index) => (
            <Markers key={`${category}-${index}`} placeName={category} lat={item.lat} lng={item.lng} />
          ))
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;