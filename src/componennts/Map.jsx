import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Markers from './Markers';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { logger } from '../logger';
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet';
import { useMap } from 'react-leaflet';

function CustomControl({toggleRoleSVisible, isLeftSectionVisible}) {
  const map = useMap();

  useEffect(() => {
    const customControl = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: function () {
        logger.log(isLeftSectionVisible);
        const classNameButton = isLeftSectionVisible ? 'leaflet-control leaflet-control-custom my-custom-button' : 'leaflet-control leaflet-control-custom my-custom-button-active';
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
  isSmallScreen
}) {
  const locationIcon = new Icon({
    iconUrl: '/icons/gps.png',
    iconSize: [50, 50],
  });
  const lat = selectedCoordinatesShowPage[0];
  const lng = selectedCoordinatesShowPage[1];
  logger.log(isSmallScreen)
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
      <MarkerClusterGroup
        maxClusterRadius={30}
        spiderfyOnMaxZoom={true}

        showCoverageOnHover={true}
      >
      {mainCategoriesToShow &&
        mainCategoriesToShow.map((category) => {
          const categoryData = places[category];
          if (categoryData) {
            return Object.entries(categoryData).map(
              ([preferenceName, preference], index) => {
                return preference.map((item, index) => {
                  return (
                    <Markers
                      key={`${category}-${index}`}
                      placeName={preferenceName}
                      lat={item.location[1]}
                      lng={item.location[0]}
                      distance={item.distance}
                      address={item.address.full}
                      name={item.name}
                    />
                  );
                });
              },
            );
          }
          return null; // Jeśli categoryData jest niezdefiniowane lub puste, zwracamy null
        })}
      </MarkerClusterGroup>
      {Object.entries(custom_names).map(
        ([categoryName, categoryList], index1) => {
          return Object.entries(categoryList).map(
            ([subcategoryName, subcategory], index2) => {
              return subcategory.map((item, index3) => {
                return (
                  <Markers
                    key={`${subcategoryName}-${index1}-${index2}-${index3}`}
                    placeName={subcategoryName} // Użycie nazwy subkategorii jako placeName
                    lat={item.location[1]}
                    lng={item.location[0]}
                    distance={item.distance}
                    address={item.address.full}
                    name={item.name}
                  />
                );
              });
            },
          );
        },
      )}
      {Object.values(custom_addresses).map((address, index1) => {
        return (
          <Markers
            key={`${address}`}
            placeName={address.address.full} // Załóżmy, że subcategory zawiera informacje o kategorii
            lat={address.location[1]}
            lng={address.location[0]}
            distance={address.commute_time.walk.distance}
            address={''}
            name={address.address.full}
          />
        );
      })}
      {isSmallScreen !== undefined && (
        <CustomControl toggleRoleSVisible={toggleRoleSVisible} isLeftSectionVisible={isLeftSectionVisible}/>
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
