import React, { useRef } from 'react';
import { SlLocationPin } from 'react-icons/sl';
import '../styles/UserLocationButton.css';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { logger } from '../logger';

export const UserLocationButton = ({ onLocationUpdate, onEnterPress }) => {
  const { t } = useTranslation();

  const showServerErrorAlert = () => {
    alert(
      'Oops! Something went wrong with our server. Please try searching for your location again later. We apologize for the inconvenience.',
    );
  };

  const handleUserLocationClick = async () => {
    try {
      const position = await getCurrentPosition();

      const address = await getAddressFromCoordinates(
        position.coords.latitude,
        position.coords.longitude,
      );

      onLocationUpdate(
        address,
        position.coords.latitude,
        position.coords.longitude,
      );
    } catch (error) {
      console.error('Error getting user location:', error);
      if (error.code === 1) {
        alert('Please allow access to your location');
      }
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${api.APP_URL_USER_API}address/?lon=${longitude}&lat=${latitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        logger.log(data);
        return data;
      } else {
        console.error(
          'Error getting address from coordinates:',
          response.statusText,
        );
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      showServerErrorAlert();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onEnterPress();
    }
  };

  const buttonRef = useRef(null);

  return (
    <button
      className="user-location-button"
      onClick={handleUserLocationClick}
      onKeyPress={handleKeyPress}
      ref={buttonRef}
      title={t('Get your location')}
    >
      <SlLocationPin id="localization-icon" />
    </button>
  );
};
