import React from 'react';
import '../styles/UserLocationButton.css'
import { SlLocationPin } from "react-icons/sl";

export const UserLocationButton = ({ onClick }) => {
  return (
    <button className="user-location-button" onClick={onClick}>
      <SlLocationPin id="localization-icon"/>
    </button>
  );
};
