import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';

export const ShowDataButton = React.forwardRef(
  ({ address, addressId, selectedPreferences }, ref) => {
    const navigate = useNavigate();
    console.log(selectedPreferences)
    const { t } = useTranslation();
    const handleUserLocationClick = async () => {
      if (addressId === '' || address === '') {
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
      let preferenceNames = selectedPreferences.map(preference => `cat=${preference.name}`).join('&');
      console.log(preferenceNames)
      if (preferenceNames === '') {
        preferenceNames = 'cat=Fast%20Food';
      }
      console.log('przed response', `${api.APP_URL_USER_API}report/?address=${address}&${preferenceNames}`);
      try {
        console.log('przed response', `${api.APP_URL_USER_API}report/?address=${address}&${preferenceNames}`);
        const response = await fetch(`${api.APP_URL_USER_API}report/?address=${address}&${preferenceNames}`, {
          method: 'Get',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
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
        title={t('Show results')}
      >
        {<Icon icon="carbon:search" id='search-icon'/>}
      </button>
    );
  },
);

export default ShowDataButton;
