import React, {useRef} from 'react';
import { SlLocationPin } from "react-icons/sl";
import '../styles/UserLocationButton.css';

export const UserLocationButton = ({ onLocationUpdate, onEnterPress }) => {
  const handleUserLocationClick = async () => {
    try {
      const position = await getCurrentPosition();

      const address = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);

      onLocationUpdate(address);
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {

    try {
      const response = await fetch(`https://15minuserapi.1213213.xyz/address/?lat=${latitude}&lon=${longitude}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, // Zamień dane na format JSON
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.error('Error getting address from coordinates:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      throw error;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onEnterPress(); // Wywołaj funkcję, którą przekazałeś jako prop (np. obsługę naciśnięcia przycisku ShowDataButton)
    }
  };

  const buttonRef = useRef(null); // Dodaj ref do przycisku

  return (
    <button className="user-location-button" onClick={handleUserLocationClick} onKeyPress={handleKeyPress} ref={buttonRef}>
      <SlLocationPin id="localization-icon" />
    </button>
  );
};
