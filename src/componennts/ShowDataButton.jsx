import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';
import { logger } from '../logger';

export const ShowDataButton = React.forwardRef(
  ({ address, addressId, selectedPreferences, transformedPreferences, preferencesSearchData }, ref) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleUserLocationClick = async () => {
      if (address === '') {
        alert(
          'Please enter an address and select it from the options provided',
        );
      } else {
        const places = await getplacesFromCoordinates();
        if (places === undefined) {
          logger.error('No places found')
        } else {
          navigate('/show-addresses', {
            state: {
              address,
              addressId,
              places,
              selectedPreferences,
              preferencesSearchData,
            },
          });
          logger.log(selectedPreferences);
        }
      }
    };

    const getplacesFromCoordinates = async () => {
      logger.log(selectedPreferences)
      logger.log(transformedPreferences)

      try {
        let custom_names = [];
        let custom_addresses = [];
        const customNamesArray = [];
        logger.log(preferencesSearchData);
        if (preferencesSearchData) {
          preferencesSearchData.forEach(item => {
            if (typeof item === 'object') {
              custom_names.push(item);
            } else if (typeof item === 'string') {
              custom_addresses.push(item);
            }
          });
        }

        custom_names.forEach(item => {
          customNamesArray.push({
            name: item.name,
            main_category: item.category,
            category: item.sub_category
          });
        });
        
        logger.log(customNamesArray);

        const requestBody = {
          address: address,
          categories: transformedPreferences,
          requested_objects: customNamesArray,
          requested_addresses: custom_addresses
        };
        logger.log(requestBody);
        const response = await fetch(`${api.APP_URL_USER_API}report/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
    
        if (response.ok) {
          const data = await response.json();
          logger.log(data);
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
        {<Icon icon="carbon:search" id='search-icon-button'/>}
      </button>
    );
  },
);

export default ShowDataButton;
