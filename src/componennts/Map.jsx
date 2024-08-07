import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import 'leaflet/dist/leaflet.css';
import { logger } from '../logger';
import GeoJSONMarkers from './GeoJSONMarkers';

function CustomControl({ toggleRoleSVisible, isLeftSectionVisible }) {
  const map = useMap();

  useEffect(() => {
    const customControl = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: function () {
        logger.log(isLeftSectionVisible);
        const classNameButton = isLeftSectionVisible
          ? 'leaflet-control leaflet-control-custom my-custom-button'
          : 'leaflet-control leaflet-control-custom my-custom-button-active';
        const container = L.DomUtil.create('button', classNameButton);
        container.onclick = function () {
          toggleRoleSVisible();
        };
        return container;
      },
    });

    const controlInstance = new customControl();
    map.addControl(controlInstance);

    // Cleanup control on component unmount
    return () => {
      map.removeControl(controlInstance);
    };
  }, [map, isLeftSectionVisible, toggleRoleSVisible]);

  return null;
}

function Map({
  places,
  categoriesToShow,
  selectedCoordinatesShowPage,
  flyToLocation,
  mainCategoriesToShow,
  preferencesSearchDataShowPage,
  custom_names,
  custom_addresses,
  toggleRoleSVisible,
  isLeftSectionVisible,
  isSmallScreen,
  geojson,
}) {
  const locationIcon = new Icon({
    iconUrl: '/icons/gps.png',
    iconSize: [50, 50],
  });

  const defaultIcon = new Icon({
    iconUrl: '/icons/gps.png', // Replace with the actual path to your default icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const lat = selectedCoordinatesShowPage[0];
  const lng = selectedCoordinatesShowPage[1];

  logger.log(isSmallScreen);
  logger.log(geojson);
  logger.log(selectedCoordinatesShowPage)
  return (
    <MapContainer
      center={selectedCoordinatesShowPage}
      zoom={16}
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
      >
        <Popup>
          <div>
            <strong>Your address</strong>
          </div>
        </Popup>
      </Marker>

      <FlyToMarkerReverse flyToLocation={selectedCoordinatesShowPage} />
      <FlyToMarker flyToLocation={flyToLocation} />

      {isSmallScreen !== undefined && (
        <CustomControl
          toggleRoleSVisible={toggleRoleSVisible}
          isLeftSectionVisible={isLeftSectionVisible}
        />
      )}
      <MarkerClusterGroup
        maxClusterRadius={30}
        spiderfyOnMaxZoom={true}

        showCoverageOnHover={true}
      >
      <GeoJSONMarkers geojson={geojson} />
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default Map;

function FlyToMarker({ flyToLocation }) {
  const { map } = useLeafletContext();
  useEffect(() => {
    if (flyToLocation) {
      const [lng, lat] = flyToLocation;
      map.flyTo([lat, lng], 16, {
        duration: 1.5,
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
      let zoomLevel = 14;
      if (window.innerWidth < 800) {
        zoomLevel = 12;
      }
      map.flyTo([lat, lng], zoomLevel, {
        duration: 0.7,
      });
    }
  }, [flyToLocation, map]);

  return null;
}
