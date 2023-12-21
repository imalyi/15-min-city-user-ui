import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Markers from './Markers';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

function Map({
  places,
  categoriesToShow,
  selectedCoordinatesShowPage,
  flyToLocation,
}) {
  const [center, setCenter] = useState(selectedCoordinatesShowPage);

  const locationIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [30, 30],
  });

  useEffect(() => {
    // Update center when selectedCoordinatesShowPage changes
    setCenter(selectedCoordinatesShowPage);
  }, [selectedCoordinatesShowPage]);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution="Jawg.Dark"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />

      <Marker position={selectedCoordinatesShowPage} icon={locationIcon} />
      <LocationMarker />
      <FlyToMarker flyToLocation={flyToLocation} />
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

function LocationMarker() {
  const map = useMapEvents({
    dblclick() {
      map.locate();
    },
    locationfound(e) {
      console.log(e);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
}

function FlyToMarker({ flyToLocation }) {
  const map = useMapEvents({
    click() {
      if (flyToLocation) {
        const [lng, lat] = flyToLocation;
        map.flyTo([lat, lng], 16, {
          duration: 1.5,
        });
      }
    },
  });
}
