import React from 'react';
//import axios from 'axios';
import { SlLocationPin } from "react-icons/sl";
import '../styles/UserLocationButton.css'

export const UserLocationButton = ({ onLocationUpdate }) => {
  const handleUserLocationClick = async () => {
    try {
      // Pobierz współrzędne geograficzne użytkownika
      const position = await getCurrentPosition();

      // Pobierz adres na podstawie współrzędnych
      //const address = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);

      // Wywołaj funkcję przekazaną przez prop onLocationUpdate z nowym adresem
      onLocationUpdate(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
/*
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = ''; // Zastąp własnym kluczem API OpenCage
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );

      const firstResult = response.data.results[0];
      const formattedAddress = firstResult.formatted;
      return formattedAddress;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      throw error;
    }
  };
*/
  return (
    <button className="user-location-button" onClick={handleUserLocationClick}>
      <SlLocationPin id="localization-icon"/>
    </button>
  );
};
