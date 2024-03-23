import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';

export const ShowDataButton = React.forwardRef(
  ({ address, addressId, selectedPreferences, preferencesSearchData }, ref) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleUserLocationClick = async () => {
      if (address === '') {
        alert(
          'Please, choose an address from the prompts or localization button',
        );
      } else {
        const places = await getplacesFromCoordinates();
        if (places === undefined) {
          alert(
            'Oops! Something went wrong with our server. Please try using our application later. We apologize for the inconvenience.',
          );
        } else {
          navigate('/show-addresses', {
            state: {
              address,
              addressId,
              places,
              selectedPreferences,
            },
          });
          console.log(places);
        }
      }
    };

    const getplacesFromCoordinates = async () => {
      try {
        let custom_names = [];
        let custom_addresses = [];
        console.log(preferencesSearchData);
        if (preferencesSearchData) {
          preferencesSearchData.forEach(item => {
            if (typeof item === 'object') {
              custom_names.push(item);
            } else if (typeof item === 'string') {
              custom_addresses.push(item);
            }
          });
        }
        const requestBody = {
          address: address,
          cat: selectedPreferences.map(preference => preference.name),
          custom_names: custom_names,
          custom_addresses: custom_addresses
        };
        console.log(requestBody);
        const response = await fetch(`${api.APP_URL_USER_API}report/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          return data;
        } else {
          console.error('Error getting report:', response.statusText);
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.error('Error getting report:', error);
      }
    };
    return (
      <button
        ref={ref}
        className="show-data-button"
        onClick={handleUserLocationClick}
        title={t('Show results')}
      >
        {<Icon icon="carbon:search" id='search-icon'/>}
      </button>
    );
  },
);

export default ShowDataButton;
