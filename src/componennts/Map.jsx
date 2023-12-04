import React from 'react';
import GoogleMapReact from 'google-map-react';
import '../styles/Map.css';
import Markers from './Markers';
const Map = () => {

  const coordinates = {lat: 54.35, lng:18.63};

  const points = [
    { placeName: "doctor", lat: 54.354331916, lng: 18.63999744 },
    { placeName: "drugstore", lat: 54.36, lng: 18.64 },
    { placeName: "fast food", lat: 54.37, lng: 18.65 },
    { placeName: "grocery store", lat: 54.36, lng: 18.63 },
    { placeName: "doctor", lat: 54.34, lng: 18.62 },
    { placeName: "drugstore", lat: 54.33, lng: 18.61 },
    { placeName: "fast food", lat: 54.35, lng: 18.60 },
    { placeName: "grocery store", lat: 54.36, lng: 18.60 }
  ];
  

  return (
    <div style={{height: '84vh', width: '100%'}}>
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
      {points.map(({ placeName, lat, lng}) => {
        return (
          <Markers placeName={placeName} lat={lat} lng={lng}/>
        );
      })}
      </GoogleMapReact>
    </div>
  );
};

export default Map;