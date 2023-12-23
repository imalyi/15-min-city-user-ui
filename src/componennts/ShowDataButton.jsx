import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';

export const ShowDataButton = React.forwardRef(
  ({ address, addressId, selectedPreferences, selectedCoordinates }, ref) => {
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
            selectedPreferences,
            selectedCoordinates,
          },
        });
        window.location.reload();
        console.log(places);
      }
    };

    const getplacesFromCoordinates = async () => {
      try {
        console.log(addressId);
        const response = await fetch(
          `${process.env.REACT_APP_URL_USER_API}report/?address_id=${addressId}`,
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
      }
    };
    return (
      <button
        ref={ref}
        className="show-data-button"
        onClick={handleUserLocationClick}
        title="Show results"
      >
        {<FaSearch id="search-icon" />}
      </button>
    );
  },
);

export default ShowDataButton;
