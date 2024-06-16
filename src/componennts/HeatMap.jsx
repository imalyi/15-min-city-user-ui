import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import L from 'leaflet';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import '../styles/HeatMap.css';
import { logger } from '../logger';
import seg from '../data/geojsonexample.json';
import ecomp from '../data/geojsonexample2.json';

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
  }, [map]);

  return null;
}

function HeatMap({ geojson, toggleRoleSVisible, isLeftSectionVisible }) {
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

  logger.log(geojson);

  return (
    <MapContainer
      center={[54.352, 18.6466]}
      zoom={11}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution="Jawg.Dark"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON data={geojson} style={setColor} />
      <GeoJSON data={seg} style={setColor} />
      <GeoJSON data={ecomp} pointToLayer={pointToLayer} />
      <CustomControl toggleRoleSVisible={toggleRoleSVisible} isLeftSectionVisible={isLeftSectionVisible}/>
    </MapContainer>
  );
}

export default HeatMap;
