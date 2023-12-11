import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';

export const ShowDataButton = React.forwardRef(
  (
    {
      address,
      addressId,
      selectedRole,
      selectedPreferences,
      selectedCoordinates,
    },
    ref,
  ) => {
    const navigate = useNavigate();

    const handleUserLocationClick = async () => {
      if (addressId === '' || address === '') {
        alert(
          'Please, choose an address from the prompts or localization button',
        );
      } else {
        const places = await getplacesFromCoordinates();

        console.log(places);

        navigate('/show-addresses', {
          state: {
            address,
            addressId,
            places,
            selectedRole,
            selectedPreferences,
            selectedCoordinates,
          },
        });
      }
    };

    const getplacesFromCoordinates = async () => {
      try {
        console.log(addressId);
        const response = await fetch(
          `https://15minuserapi.1213213.xyz/report/?address_id=${addressId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.osm.points_of_interest);
          return data;
        } else {
          console.error(
            'Error getting places from addressId:',
            response.statusText,
          );
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.error('Error getting places from addressId:', error);
        throw error;
      }
    };
    return (
      <button
        ref={ref}
        className="show-data-button"
        onClick={handleUserLocationClick}
      >
        {<FaSearch id="search-icon" />}
      </button>
    );
  },
);

export default ShowDataButton;
