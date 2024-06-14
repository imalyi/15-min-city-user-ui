import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import Markers from './Markers';
import '../styles/Map.css';
import '../styles/Leaflet.css';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { logger } from '../logger';
import seg from '../data/geojsonexample.json'
import ecomp from '../data/geojsonexample2.json'
import L, { divIcon } from "leaflet";
import '../styles/HeatMap.css';

function HeatMap({
  geojson,
}) {

  const setColor = ({ properties }) => {
    return { weight: 1, color: '#000' };
  };

  const pointToLayer = ({ properties }, latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon(properties.Name) });
  };
  const customMarkerIcon = (name) =>
    divIcon({
      html: name,
      className: "icon"
  });
  logger.log(geojson)

  return (
    <MapContainer
      center={[54.3520, 18.6466]}
      zoom={11}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution="Jawg.Dark"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />
    <GeoJSON data={geojson} style={setColor}/>

    <GeoJSON data={seg} style={setColor} />
    <GeoJSON data={ecomp} pointToLayer={pointToLayer} />


    </MapContainer>
  );
}

export default HeatMap;

