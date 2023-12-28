import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Markers from './Markers';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';

function Map({
  places,
  categoriesToShow,
  selectedCoordinatesShowPage,
  flyToLocation,
}) {
  const [center, setCenter] = useState(selectedCoordinatesShowPage);

  const locationIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [40, 40],
  });

  useEffect(() => {
    // Update center when selectedCoordinatesShowPage changes
    setCenter(selectedCoordinatesShowPage);
  }, [selectedCoordinatesShowPage]);

  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom={true}>
      <TileLayer
        attribution="Jawg.Dark"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />

      <Marker
        className="markerContainer-location"
        zIndexOffset={200}
        position={selectedCoordinatesShowPage}
        icon={locationIcon}
      />
      <FlyToMarker flyToLocation={flyToLocation} />
      {categoriesToShow.map((category) =>
        places[category]?.map((item, index) => (
          <Markers
            key={`${category}-${index}`}
            placeName={category}
            lat={item.location[1]}
            lng={item.location[0]}
            distance={item.distance}
            address={item.address.full}
            name={item.name}
          />
        )),
      )}
    </MapContainer>
  );
}

export default Map;

function FlyToMarker({ flyToLocation }) {
  const { map } = useLeafletContext();
  useEffect(() => {
    if (flyToLocation) {
      const [lng, lat] = flyToLocation;
      map.flyTo([lat, lng], 18, {
        duration: 1,
      });
    }
  }, [flyToLocation, map]);

  return null;
}
