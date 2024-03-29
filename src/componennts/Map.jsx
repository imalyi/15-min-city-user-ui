import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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
  mainCategoriesToShow,
  preferencesSearchDataShowPage,
  custom_names,
  custom_addresses,
}) {
  const locationIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [40, 40],
  });


  return (
    <MapContainer
      center={selectedCoordinatesShowPage}
      zoom={17}
      scrollWheelZoom={true}
      zoomControl={false}
    >
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
      <FlyToMarkerReverse flyToLocation={selectedCoordinatesShowPage} />
      <FlyToMarker flyToLocation={flyToLocation} />
      {mainCategoriesToShow && mainCategoriesToShow.map(category => {
        return Object.values(places[category]).map((preference, index) => {
          return preference.map((item, index) => {
            return (
              <Markers
                key={`${category}-${index}`}
                placeName={category}
                lat={item.location[1]}
                lng={item.location[0]}
                distance={item.distance}
                address={item.address.full}
                name={item.name}
              />
            );
          });
        });
      })}
      {Object.values(custom_names).map((categoryList, index1) => {
        return Object.values(categoryList).map((subcategory, index2) => {
          return subcategory.map((item, index3) => {
            return (
              <Markers
                key={`${categoryList}-${index1}-${index2}-${index3}`}
                placeName={item.name} // Załóżmy, że subcategory zawiera informacje o kategorii
                lat={item.location[1]}
                lng={item.location[0]}
                distance={item.distance}
                address={item.address.full}
                name={item.name}
              />
            );
          });
        });
      })}
      {Object.values(custom_addresses).map((address, index1) => {
            return (
              <Markers
                key={`${address}`}
                placeName={address.address.full} // Załóżmy, że subcategory zawiera informacje o kategorii
                lat={address.location[1]}
                lng={address.location[0]}
                distance={address.commute_time.walk.distance}
                address={""}
                name={address.address.full}
              />
            );
      })}
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

function FlyToMarkerReverse({ flyToLocation }) {
  const { map } = useLeafletContext();
  useEffect(() => {
    if (flyToLocation) {
      const [lat, lng] = flyToLocation;
      map.flyTo([lat, lng], 13, {
        duration: 0.5,
      });
    }
  }, [flyToLocation, map]);

  return null;
}
