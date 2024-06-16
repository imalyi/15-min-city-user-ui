import React, { useState, useRef, useEffect } from 'react';
import '../styles/HeatMapComponent.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Roles from './Roles';
import HeatMap from './HeatMap';
import { logger } from '../logger';
import api from '../config';
import Footer from './Footer';
function HeatMapComponent() {

    const { i18n, t } = useTranslation();
    const [selectedPreferencesShowPage, setSelectedPreferencesShowPage] = useState([]);
    const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(true);
    const [preferencesSearchDataShowPage, setPreferencesSearchDataShowPage] = useState([]);
    const [selectedPreferencesSearch, setSelectedPreferencesSearch] = useState([]);
    const [preferencesData, setPreferencesData] = useState([]);
    const [geojson, setGeojson] = useState([]);

    logger.log(selectedPreferencesShowPage)
    logger.log(preferencesData)
    logger.log(preferencesSearchDataShowPage)
    logger.log(selectedPreferencesSearch)

    const filteredPreferencesData = Object.keys(preferencesData).reduce(
        (acc, key) => {
          // Filtruj preferencje w danej kategorii
          const filteredPreferences = preferencesData[key].filter((preference) => {
            return selectedPreferencesShowPage.some(
              (selectedPreference) => selectedPreference.name === preference.name,
            );
          });
    
          // Jeśli istnieją jakieś pasujące preferencje, dodaj je do wynikowej tablicy
          if (filteredPreferences.length > 0) {
            acc[key] = filteredPreferences;
          }
    
          return acc;
        },
        {},
    );

    logger.log(filteredPreferencesData)
    logger.log(geojson)
    const transformData = (data) => {
        const result = [];
        
        for (const main_category in data) {
          data[main_category].forEach(item => {
            result.push({
              main_category,
              category: item.name
            });
          });
        }
        
        return result;
      };
      
    const transformedData = transformData(filteredPreferencesData);
    console.log(transformedData);

    const handlePreferencesSelect = (preferences) => {
        setSelectedPreferencesShowPage(preferences);
    };

    const handleToggleLeftSection = () => {
        setIsLeftSectionVisible((prev) => !prev);
    };

    const handlePreferencesData = (data) => {
        setPreferencesData(data);
    };

    const handlePreferencesSearchSelect = (preferences) => {
        setPreferencesSearchDataShowPage(preferences);
    };

    const handleEnterPress = () => {
        
    };

    const fetchHeatmap = async () => {
        setGeojson([]);
        const data = transformedData;
        logger.log("da" + 'res')

        try {
            const res = await fetch(`${api.APP_URL_USER_API}heatmap/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }
            logger.log(res + 'res')
            const result = await res.json();
            setGeojson(result);
            logger.log(result)
        } catch (err) {
            logger.error(err);
        }
    };



    


  return (
    <div className='HeatMapPage'>
        <div>
            <Link to="/">
            <button className="logo-show-data" title={t('Search Page')}>
                <img
                src={'/images/15min_logo.svg'}
                alt="Red Cross"
                className="centered-img-cross"
                />
            </button>
            </Link>
            <button className="logo-show-data" title={t('Search Page')}>
                <img
                src={'/images/look-up-svgrepo-com.svg'}
                alt="Red Cross"
                className="centered-img-cross"
                onClick={fetchHeatmap}
                />
            </button>
        </div>
        <div className='show-data-map'>
            <div className='left-section'> 
                <Roles
                    onSelectPreferences={handlePreferencesSelect}
                    selectedPreferencesShowPage={selectedPreferencesShowPage}
                    toggleRoleSVisible={handleToggleLeftSection}
                    isLeftSectionVisible={isLeftSectionVisible}
                    setPreferencedDataShowPage={handlePreferencesData}
                    preferencesSearchDataShowPage={
                        preferencesSearchDataShowPage
                    }
                    setPreferencesSearchDataShowPage={
                        handlePreferencesSearchSelect
                    }
                    handleSearch={handleEnterPress}
                />
            </div>
            <div
                className={`right-section map-container ${
                  isLeftSectionVisible ? '' : 'right-section-center'
                }`}
              >
                {Object(geojson).length != 0 ? (
                    <HeatMap geojson={geojson} toggleRoleSVisible={handleToggleLeftSection} isLeftSectionVisible={isLeftSectionVisible}/>
                ) : (
                    <p>Check your categories and click on search button - Test heatmap. Please wait 5-30 seconds</p>
                )}
            </div>
        </div>
        <Footer useMargin={true} />
    </div>
  );   
}

export default HeatMapComponent;
