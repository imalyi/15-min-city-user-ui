import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import L from 'leaflet';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import '../styles/HeatMap.css';
import { logger } from '../logger';

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

function HeatMap({ geojson, toggleRoleSVisible, isLeftSectionVisible, isSmallScreen }) {
  const [mapCenter, setMapCenter] = useState(isSmallScreen ? [54.435787, 18.558210] : [54.42577, 18.727222]);


  const setColor = ({ properties }) => {
    return { weight: 1, color: '#000' };
  };
  logger.log(isLeftSectionVisible);

  const pointToLayer = ({ properties }, latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon(properties.Name) });
  };

  const customMarkerIcon = (name) =>
    divIcon({
      html: name,
      className: 'icon',
    });
  

  

  return (
    <MapContainer
      center={mapCenter}
      zoom={11}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{marginTop: '5vh'}}
    >
      <TileLayer
        attribution="Jawg.Dark"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON data={geojson} style={setColor} />
      {!isSmallScreen &&(
        <CustomControl toggleRoleSVisible={toggleRoleSVisible} isLeftSectionVisible={isLeftSectionVisible}/>
      )}
      
    </MapContainer>
  );
}

export default HeatMap;