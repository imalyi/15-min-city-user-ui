import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';
import { logger } from '../logger';
import { ReportFetch } from './api.jsx';

export const ShowDataButton = React.forwardRef(
  (
    {
      address,
      addresses,
      selectedPreferences,
      transformedPreferences,
      preferencesSearchData,
      ShowDataButtonCompare,
      setAlarm,
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleUserLocationClick = async () => {
      if (address == '') {
        if (ShowDataButtonCompare !== 'alert-none') {
          setAlarm(t('invalid address'));
        }
      } else {
        const places = await getplacesFromCoordinates();
        if (places === undefined) {
          logger.error('No places found');
          setAlarm(t('invalid address'));
        } else {
          navigate('/show-addresses', {
            state: {
              address,
              addresses,
              places,
              selectedPreferences,
              preferencesSearchData,
            },
          });
        }
      }
    };

    const getplacesFromCoordinates = async () => {
      try {
        let custom_names = [];
        let custom_addresses = [];
        const customNamesArray = [];
        if (preferencesSearchData) {
          preferencesSearchData.forEach((item) => {
            if (typeof item === 'object') {
              custom_names.push(item);
            } else if (typeof item === 'string') {
              custom_addresses.push(item);
            }
          });
        }

        custom_names.forEach((item) => {
          customNamesArray.push({
            name: item.name,
            main_category: item.category,
            category: item.sub_category,
          });
        });

        const requestBody = {
          address: address,
          categories: transformedPreferences,
          requested_objects: customNamesArray,
          requested_addresses: custom_addresses,
        };
        
        const data = await ReportFetch(requestBody, api.APP_URL_USER_API);
        return data;

      } catch (error) {
        console.error('Error getting report:', error);
      }
    };
    return (
      <div>
        <button
          ref={ref}
          className="show-data-button-invisible"
          onClick={handleUserLocationClick}
        />
        <button
          className="show-data-button"
          onClick={handleUserLocationClick}
          title={t('Show results')}
        >
          {<Icon icon="carbon:search" id="search-icon-button" />}
        </button>
      </div>
    );
  },
);

export default ShowDataButton;
