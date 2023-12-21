import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Tooltip,
} from 'react-leaflet';
import Markers from './Markers';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

function Map({ places, categoriesToShow, selectedCoordinatesShowPage }) {
  const [center, setCenter] = useState(selectedCoordinatesShowPage);

  useEffect(() => {
    // Update center when selectedCoordinatesShowPage changes
    setCenter(selectedCoordinatesShowPage);
  }, [selectedCoordinatesShowPage]);

  const locationIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [30, 30],
  });

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution="Jawg.Dark"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />

      <Marker position={selectedCoordinatesShowPage} icon={locationIcon} />

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
    </MapContainer>
  );
}

export default Map;
/*


      */
