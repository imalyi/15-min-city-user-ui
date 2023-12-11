import React from 'react';
import GoogleMapReact from 'google-map-react';
import '../styles/Map.css';
import Markers from './Markers';
import { BiSolidMap } from 'react-icons/bi';

const Map = ({ places, categoriesToShow, selectedCoordinatesShowPage }) => {
  console.log(selectedCoordinatesShowPage);

  return (
    <div style={{ height: '76.3vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCoR0IBs5iHPFGyq3Q8DsuBRZZjziBSVQg' }}
        defaultCenter={selectedCoordinatesShowPage}
        center={selectedCoordinatesShowPage}
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
          lat={Number(selectedCoordinatesShowPage[0])}
          lng={Number(selectedCoordinatesShowPage[1])}
        >
          <div>
            <BiSolidMap id="map-coordinates-marker" fontSize="x-large" />
          </div>
        </div>
        {categoriesToShow.map((category) =>
          places[category]?.map((item, index) => (
            <Markers
              key={`${category}-${index}`}
              placeName={category}
              lat={item.location[1]}
              lng={item.location[0]}
            />
          )),
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
