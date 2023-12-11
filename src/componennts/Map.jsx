import React from 'react';
import GoogleMapReact from 'google-map-react';
import '../styles/Map.css';
import Markers from './Markers';
import { BiSolidMap } from 'react-icons/bi';

const Map = ({ jsonData, categoriesToShow }) => {
  const coordinates = { lat: 54.35, lng: 18.63 };

  return (
    <div style={{ height: '76.3vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCoR0IBs5iHPFGyq3Q8DsuBRZZjziBSVQg' }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={13}
        margin={[50, 50, 50, 50]}
        options={{
          gestureHandling: 'greedy', // Ustawienie 'greedy' umożliwia przewijanie mapy jednym palcem
          draggable: true, // Ustawienie draggable na true pozwala na przesuwanie mapy
        }}
        onChange={''}
        onChildClick={''}
      >
        <div
          className="markerContainer"
          lat={Number(coordinates.lat)}
          lng={Number(coordinates.lng)}
        >
          <div>
            <BiSolidMap id="map-coordinates-marker" fontSize="x-large" />
          </div>
        </div>
        {categoriesToShow.map((category) =>
          jsonData[category]?.map((item, index) => (
            <Markers
              key={`${category}-${index}`}
              placeName={category}
              lat={item.lat}
              lng={item.lng}
            />
          )),
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
