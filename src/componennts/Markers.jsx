import React from 'react';
import { IoFastFood } from 'react-icons/io5';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaPills } from 'react-icons/fa';
import { FaStore } from 'react-icons/fa';

const Markers = ({ placeName, lat, lng }) => {
  let markerIcon;

  if (placeName === 'doctor') {
    markerIcon = <FaUserDoctor id="doctor-marker" fontSize="large" />;
  } else if (placeName === 'fast food') {
    markerIcon = <IoFastFood id="fast-food-marker" fontSize="large" />;
  } else if (placeName === 'drugstore') {
    markerIcon = <FaPills id="drugstore-marker" fontSize="large" />;
  } else if (placeName === 'grocery store') {
    markerIcon = <FaStore id="grocery-store-marker" fontSize="large" />;
  }
  return (
    <div className="markerContainer" lat={Number(lat)} lng={Number(lng)}>
      <div className="markerSquare">{markerIcon}</div>
    </div>
  );
};

export default Markers;
