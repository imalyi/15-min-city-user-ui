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
    const [loadHeatmap, setLoadHeatmap] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);
    const [isExpanded, setIsExpanded] = useState(false);
    const [IdHeatMap, setIdHeatMap] = useState('');
    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 450);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleIsExpandedClick = () => {
      setIsExpanded(!isExpanded);
    };
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
    logger.log(loadHeatmap)

    const fetchHeatmap = async () => {
        handleIsExpandedClick();  
        if (loadHeatmap) {
            return;
        }
        if (transformedData.length === 0) {
            setGeojson([]);
            return;
        }
        setGeojson([]);
        const data = transformedData;
        logger.log("da" + 'res')
        setLoadHeatmap(true);
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
            setIdHeatMap(result);
            logger.log(result);
            const pollHeatmapStatus = async () => {
              try {
                  const res_heatmap = await fetch(`${api.APP_URL_USER_API}heatmap/task_status/${result.task_id}`, {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  });
      
                  if (!res_heatmap.ok) {
                      throw new Error(`Error: ${res_heatmap.status}`);
                  }
                  logger.log(res_heatmap)
                  const heatmapResult = await res_heatmap.json();
                  logger.log(heatmapResult);
                  if (heatmapResult.status == 'success') {
                      setGeojson(heatmapResult.result);
                      logger.log(heatmapResult);
                      setLoadHeatmap(false);
                      clearInterval(intervalId); // Stop polling when geojson is found
                  } else {
                      logger.log("GeoJSON not available yet");
                  }
              } catch (err) {
                  logger.error(err);
                  clearInterval(intervalId); // Stop polling on error
              }
            };

            const intervalId = setInterval(pollHeatmapStatus, 1000); // Poll every second

        } catch (err) {
            logger.error(err);
      }

};



    


  return (
    <div className='HeatMapPage'>
      <div style={{flex: '1'}}>
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
        </div>
        {isSmallScreen ? (
            <div className="show-data-map-responsiveness">
              <div className="right-section-responsiveness map-container"> 
                {Object(geojson).length != 0 && geojson != null ? (
                      <HeatMap geojson={geojson} toggleRoleSVisible={handleToggleLeftSection} isLeftSectionVisible={isLeftSectionVisible} isSmallScreen={isSmallScreen}/>
                  ) : loadHeatmap == true ? (
                      <div className='heat-map-instruction-with-loader'>
                          <p className='heat-map-instruction-text-loader'>
                              {t('Please wait while the heatmap is being generated.')}
                          </p>
                          <div class="loader" style={{marginTop: '16vh'}}></div>
                      </div>  
                  ) : geojson == null ? (
                    <div className='heat-map-instruction'>
                      <p className='heat-map-instruction-text'>
                        {t('Sorry, no data available for the selected categories.')}
                        <br />
                        {t('Please try again with different categories.')}
                      </p>
                    </div>  
                  ) : (
                    <div className='heat-map-instruction'>
                      <p className='heat-map-instruction-text'>
                        {t('Select the categories and click "Show on map" to display the heatmap.')}
                      </p>
                    </div>  
                  )}
              </div>
              <div className="left-section-responsiveness">
                {isExpanded == false ? (
                  <div
                    className="choose-criteria-mobile-div"
                    onClick={() => handleIsExpandedClick()}
                  >
                    <div className="choose-criteria-mobile">
                      {t('Select criteria')}
                    </div>
                  </div>
                ) : (
                  <div className="modal-overlay-category">
                    <div className="modal-contents-category">
                      <Roles
                        onSelectPreferences={handlePreferencesSelect}
                        selectedPreferencesShowPage={
                          selectedPreferencesShowPage
                        }
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
                        isMobile={true}
                        toggleExpendedClick={handleIsExpandedClick}
                        isHeatmap={true}
                        fetchHeatmap={fetchHeatmap}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
          <div className='show-data-map'>
              <div className='left-section' style={{width: '40vw', height: '77vh'}}> 
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
                      isHeatmap={true}
                      fetchHeatmap={fetchHeatmap}
                  />
              </div>
              <div
                  className={`right-section map-container ${
                    isLeftSectionVisible ? '' : 'right-section-center'
                  }`}
                  style={{ width: isLeftSectionVisible ? '60vw' : '350%', height: '76.5vh'}}
                >
                  {Object(geojson).length != 0 && Object(geojson.features).length != 0 ? (
                      <HeatMap geojson={geojson} toggleRoleSVisible={handleToggleLeftSection} isLeftSectionVisible={isLeftSectionVisible} isSmallScreen={isSmallScreen}/>
                  ) : loadHeatmap == true ? (
                      <div className='heat-map-instruction-with-loader'>
                          <p className='heat-map-instruction-text-loader'>
                              {t('Please wait while the heatmap is being generated.')}
                          </p>
                          <div class="loader" style={{marginTop: '16vh'}}></div>
                      </div>  
                  ) : Object(geojson.features).length == 0 ? (
                    <div className='heat-map-instruction'>
                      <p className='heat-map-instruction-text'>
                        {t('Sorry, no data available for the selected categories.')}
                        <br />
                        {t('Please try again with different categories.')}
                      </p>
                    </div>  
                  ) : (
                    <div className='heat-map-instruction'>
                      <p className='heat-map-instruction-text'>
                        {t('Select the categories and click "Show on map" to display the heatmap.')}
                      </p>
                    </div>  
                  )}
              </div>
          </div>
          )}
        </div>
        <Footer useMargin={true} />
    </div>
  );   
}

export default HeatMapComponent;
