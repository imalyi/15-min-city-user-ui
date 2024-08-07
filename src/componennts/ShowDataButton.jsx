import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowDataButton.css';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../config';
import { Icon } from '@iconify/react';
import { logger } from '../logger';
import { ReportFetch, ReportIdFetch, useAuthFetch } from './api.jsx';
import { get } from 'animejs';
import { useCookies } from 'react-cookie';


export const ShowDataButton = React.forwardRef(
  (
    {
      address,
      addresses,
      results,
      selectedPreferences,
      transformedPreferences,
      preferencesSearchData,
      ShowDataButtonCompare,
      setAlarm,
      IconVisibility
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [cookies, setCookie] = useCookies(['token']);

    const { fetchWithAuth, token } = useAuthFetch();
    const handleUserLocationClick = async () => {
      if (address == '') {
        if (ShowDataButtonCompare !== 'alert-none') {
          setAlarm(t('invalid address'));
        }
      } else {
        const report_id = await getReportId();
        if (report_id === null || report_id === undefined) {
          logger.error('No report id found');
          setAlarm(t('Server error'));
          return;
        }
        const poi = await getplacesFromCoordinates(report_id);
        const places = poi.result.full
        const geojson = poi.result.geojson
        if (places === undefined) {
          logger.error('No places found');
          setAlarm(t('invalid address'));
        } else {
          navigate('/show-addresses', {
            state: {
              address,
              addresses,
              places,
              geojson,
              selectedPreferences,
              preferencesSearchData,
            },
          });
          
          
        }
      }
    };

    const getReportId = async () => {
      try {
        const item = results.find((item) => item.fullAddress === address);
        if (item === undefined) {
          return null;
        }
        let ids = transformedPreferences.map(item => item.id);
        if (ids.length === 0 || ids[0] === undefined) {
          ids = [];
        }
        const requestBody = {
          addressId: item.id,
          categoryIds: ids,
          customAddressIds: [],
          distance: 1000,
        };
        const data = await ReportIdFetch(requestBody, api.APP_URL_USER_API, cookies.token, fetchWithAuth);
        logger.log(data);
        return data;
      } catch (error) {
        console.error('Error getting report id:', error);
      }
    };

    const getplacesFromCoordinates = async (report_id) => {
      try {
 /*       let custom_names = [];
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
        */
        logger.log(report_id)
        if (report_id === undefined) {
          return;
        }

        let data = await ReportFetch(report_id, api.APP_URL_USER_API, cookies.token, fetchWithAuth);
        logger.log(data)
        const task_id = data.task_id;
        while (true) {
          logger.log(data)
          logger.log(data.status);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (data.status === 'Pending' && data.task_id !== "undefined") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            data = await ReportFetch(task_id, api.APP_URL_USER_API, cookies.token, fetchWithAuth);
            logger.log(data)
          }
          if (data.task_id === "undefined") {
            logger.log(data)
            return;
          }
          if (data.status === "Success") {
            logger.log(data)
            return data;
          }
          logger.log(data)

        }
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
        {IconVisibility && (
        <button
          className="show-data-button"
          onClick={handleUserLocationClick}
          title={t('Show results')}
        >
          {<Icon icon="carbon:search" id="search-icon-button" />}
        </button>
        )
        }

      </div>
    );
  },
);

export default ShowDataButton;
