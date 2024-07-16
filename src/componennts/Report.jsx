import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Report.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { logger } from '../logger';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import anime from 'animejs';
import { useCookies } from 'react-cookie';
import api from '../config';
import { use } from 'i18next';
import { loadDataFetch, ReportFetch } from './api.jsx';

function Report() {
  const location = useLocation();
  const [cookies, setCookie] = useCookies(['userID']);
  const searchParams = new URLSearchParams(location.search);
  const { i18n, t } = useTranslation();
  const [address, setAddress] = useState(searchParams.get('address'));
  const [places, setPlaces] = useState({});
  const [transformedPreferences, setTransformedPreferences] = useState('');
  const [custom_objects, setCustomObject] = useState([]);
  const [custom_addresses, setCustomAddresses] = useState([]);
  const [requested_objects, setRequestedObjects] = useState([]);
  const [requested_addresses, setRequestedAddresses] = useState([]);
  const categories = places ? Object.keys(places) : null;
  /*
  const custom_addresses = places.custom_addresses
    ? Object.entries(places.custom_addresses)
    : null;
  const custom_objects = places.custom_addresses
    ? Object.entries(places.custom_objects)
    : null;
    */

  const userId = searchParams.get('userid');
  const [selectedCategoryPreferences, setselectedCategoryPreferences] =
    useState(null);
  logger.log(selectedCategoryPreferences, 'aaa');
  const [selectedAddressPreferences, setselectedAddressPreferences] =
    useState(false);
  const [selectedObjectPreferences, setselectedObjectPreferences] =
    useState(false);
  const [allPreferences, setAllPreferences] = useState([]);
  logger.log(allPreferences)
  const [selectedCategory, setselectedCategory] = useState(null);

  const handleObjectClick = () => {
    setselectedCategoryPreferences(null);
    setselectedCategory(null);
    setselectedObjectPreferences(true);
    setselectedAddressPreferences(false);
    setIsCategoryToggle(false);
  };
  const handleAddressClick = () => {
    setselectedCategoryPreferences(null);
    setselectedCategory(null);
    setselectedAddressPreferences(true);
    setselectedObjectPreferences(false);
    setIsCategoryToggle(false);
  };
  const handleCategoryClick = (category) => {
    logger.log(places);
    setIsCategoryToggle(false);
    setselectedCategoryPreferences(places[category], 'bbb');
    logger.log(places[category]);
    setselectedCategory(category);
    setselectedAddressPreferences(false);
    setselectedObjectPreferences(false);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);
  const [isCategoryToggle, setIsCategoryToggle] = useState(false);

  const handleCategoryToggle = () => {
    setIsCategoryToggle(!isCategoryToggle);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoadDataCategorySelected = (category, places) => {
    logger.log(places);
    if (category === 'custom_addresses') {
      handleAddressClick();
    } else if (category === 'custom_objects') {
      handleObjectClick();
    } else if (places !== null) {
      logger.log(places);
      setselectedCategoryPreferences(places[category]);
      logger.log(places[category]);
      setselectedCategory(category);
      setselectedAddressPreferences(false);
      setselectedObjectPreferences(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData(userId);
    }
  }, []);
  logger.log(selectedCategory);
  logger.log(selectedAddressPreferences);
  logger.log(selectedObjectPreferences);
  const loadData = async (id) => {
    try {
      const storedData = localStorage.getItem('myData');
      let request = {};
      if (storedData) {
        request = JSON.parse(storedData);
      }
      logger.log(request);

      const reportWithRequestedAddress = request.addresses.find(
        (report) => report === address,
      );

      const requestBody = {
        address: reportWithRequestedAddress,
        categories: request.categories,
        requested_objects: request.requested_objects,
        requested_addresses: request.requested_addresses,
      };
      
      const data = await ReportFetch(requestBody, api.APP_URL_USER_API);
        logger.log(data)

        if (reportWithRequestedAddress) {
          // Jeśli znaleziono raport z odpowiednim adresem, ustawiamy dane
          setCustomAddresses(data.custom_addresses);
          setCustomObject(data.custom_objects);
          setPlaces(data.points_of_interest);
          logger.log(data.points_of_interest);
          logger.log(data.custom_objects);
          i18n.changeLanguage(request.language);

          setAllPreferences(() => {
            return data.points_of_interest
              ? Object.values(
                data.points_of_interest,
                ).flatMap((category) => {
                  return Object.keys(category).flatMap((subcategory) =>
                    category[subcategory].map((item) => ({
                      key: subcategory,
                      value: true,
                    })),
                  );
                })
              : [];
          });
          const allObjectsLoad = [];
          Object.keys(data.custom_objects).forEach(
            (categoryName) => {
              Object.keys(
                data.custom_objects[categoryName],
              ).forEach((subcategoryName) => {
                data.custom_objects[categoryName][
                  subcategoryName
                ].forEach((item) => {
                  allObjectsLoad.push({
                    name: item.name,
                    location: item.location,
                    address: item.address,
                    distance: item.distance,
                  });
                });
              });
            },
          );
          if (data.custom_addresses.length > 0) {
            handleLoadDataCategorySelected('custom_addresses', null);
            logger.log('handleAddressClick');
          } else if (
            Object.keys(data.custom_objects).length > 0 &&
            allObjectsLoad.length > 0
          ) {
            handleLoadDataCategorySelected('custom_objects', null);
            logger.log('handleObjectClick');
          } else {
            handleLoadDataCategorySelected(
              Object.keys(data.points_of_interest)[0],
              data.points_of_interest,
            );
            logger.log(
              'handleCategoryClick',
              data.points_of_interest,
            );
          }
        }

    } catch (error) {
      console.error('Error getting report:', error);
    }
  };

  const allObjects = [];
  Object.keys(custom_objects).forEach((categoryName) => {
    Object.keys(custom_objects[categoryName]).forEach((subcategoryName) => {
      custom_objects[categoryName][subcategoryName].forEach((item) => {
        allObjects.push({
          name: item.name,
          location: item.location,
          address: item.address,
          distance: item.distance,
        });
      });
    });
  });
  logger.log(allObjects);
  const handlePreferencesClick = (category) => {
    // Aktualizacja wartości value na false po kliknięciu
    setAllPreferences((prevPreferences) =>
      prevPreferences.map((preference) => {
        if (preference.key === category) {
          return { ...preference, value: !preference.value };
        }
        return preference;
      }),
    );
  };

  const scrollToRight = () => {
    const scrollContainer = document.querySelector('.selected-category-label');
    anime({
      targets: scrollContainer,
      scrollLeft: '+=500',
      duration: 500, // Czas trwania animacji w milisekundach
      easing: 'easeInOutQuad', // Rodzaj interpolacji animacji
    });
  };

  const scrollToLeft = () => {
    const scrollContainer = document.querySelector('.selected-category-label');
    anime({
      targets: scrollContainer,
      scrollLeft: '-=500',
      duration: 500, // Czas trwania animacji w milisekundach
      easing: 'easeInOutQuad', // Rodzaj interpolacji animacji
    });
  };

  return (
    <div className="report">
      <div className="reportContainer">
        <div className="reportBar">
          <div>
            <Link to="/">
              <button className="logo" title={t('Search Page')}>
                <img
                  src={'/images/15min_logo.svg'}
                  alt="Red Cross"
                  className="centered-img-cross"
                />
              </button>
            </Link>
          </div>
          <div className="chooseAddress">
            <div className="addressName">{address}</div>
          </div>
        </div>
        {Object.keys(places).length !== 0 ||
        Object.keys(custom_objects).length !== 0 ||
        Object.keys(custom_addresses).length !== 0 ? (
          <div className="reportMain">
            {isSmallScreen ? (
              <div>
                <div
                  className={
                    isCategoryToggle
                      ? 'report-choose-main-border-bottom'
                      : 'report-choose-main'
                  }
                  onClick={() => handleCategoryToggle()}
                >
                  <div>
                    <div className="report-selected-category">
                      <label className="report-selected-category-label">
                        {selectedAddressPreferences !== false
                          ? t('Your locations')
                          : selectedObjectPreferences !== false
                            ? t('Your places')
                            : t(selectedCategory)}
                      </label>

                      {isCategoryToggle ? (
                        <IoIosArrowUp className="toggleCategorySection" />
                      ) : (
                        <IoIosArrowDown className="toggleCategorySection" />
                      )}
                    </div>
                  </div>
                </div>
                {isCategoryToggle === true ? (
                  <div>
                    <div className="report-category-hr-color">
                      <hr className="report-category-hr" />
                    </div>
                    <div className="report-choose-toggle">
                      {custom_addresses && custom_addresses.length > 0 ? (
                        <div
                          onClick={() => handleAddressClick()}
                          className="report-category-item"
                        >
                          <div>{t('Your locations')}</div>
                        </div>
                      ) : null}
                      {allObjects && allObjects.length > 0 ? (
                        <div
                          onClick={() => handleObjectClick()}
                          className="report-category-item"
                        >
                          <div>{t('Your places')}</div>
                        </div>
                      ) : null}
                      {categories &&
                        categories.map((category, index) => (
                          <div
                            key={index}
                            onClick={() => handleCategoryClick(category)}
                            className="report-category-item"
                          >
                            <div>{t(category)}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div
                className={
                  categories && categories.length <= 9
                    ? 'leftReport-short'
                    : 'leftReport'
                }
              >
                {custom_addresses && custom_addresses.length > 0 ? (
                  <div>
                    <div
                      className={
                        selectedAddressPreferences === true
                          ? 'categoryNameSelected'
                          : 'categoryName'
                      }
                      onClick={() => handleAddressClick()}
                    >
                      <label className="categoryLabel">
                        {t('Your locations')}
                      </label>
                    </div>
                    <div
                      className={
                        selectedAddressPreferences === true
                          ? 'show-data-hr-place-selected'
                          : 'show-data-hr-place'
                      }
                    >
                      <hr className="show-data-search-place-hr" />
                    </div>
                  </div>
                ) : null}
                {allObjects && allObjects.length > 0 ? (
                  <div>
                    <div
                      className={
                        selectedObjectPreferences === true
                          ? 'categoryNameSelected'
                          : 'categoryName'
                      }
                      onClick={() => handleObjectClick()}
                    >
                      <label className="categoryLabel">
                        {t('Your places')}
                      </label>
                    </div>
                    <div
                      className={
                        selectedObjectPreferences === true
                          ? 'show-data-hr-place-selected'
                          : 'show-data-hr-place'
                      }
                    >
                      <hr className="show-data-search-place-hr" />
                    </div>
                  </div>
                ) : null}
                {categories &&
                  categories.map((category, index) => (
                    <div>
                      <div
                        key={index}
                        className={
                          category === selectedCategory
                            ? 'categoryNameSelected'
                            : 'categoryName'
                        }
                        onClick={() => handleCategoryClick(category)}
                      >
                        <label className="categoryLabel">{t(category)}</label>
                      </div>
                      <div
                        className={
                          category === selectedCategory
                            ? 'show-data-hr-place-selected'
                            : 'show-data-hr-place'
                        }
                      >
                        <hr className="show-data-search-place-hr" />
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <div className="rightReport">
              {selectedCategoryPreferences ? (
                <>
                  <div className="selected-category-container">
                    <div className="selected-category-label">
                      <div className="scrollButtonLeft" onClick={scrollToLeft}>
                        {
                          <Icon
                            icon="lets-icons:expand-left"
                            id="expand-left"
                          />
                        }
                      </div>
                      <div className="margin-left-report"></div>
                      {Object.keys(selectedCategoryPreferences).map(
                        (category, index) => {
                          const preference = allPreferences.find(
                            (pref) => pref.key === category,
                          );
                          logger.log(preference);
                          let className = 'preferenceNameWithoutData';
                          if (preference){
                            className =
                            preference && preference.value === true
                              ? 'preferenceName'
                              : 'preferenceNameDisabled';
                          }
                          return (
                            <div
                              className={className}
                              key={index}
                              onClick={() => handlePreferencesClick(category)}
                            >
                              <div className="preferenceLabel">
                                {t(category)}
                              </div>
                            </div>
                          );
                        },
                      )}
                      <div className="margin-right-report"></div>
                      <div
                        className="scrollButtonRight"
                        onClick={scrollToRight}
                      >
                        {
                          <Icon
                            icon="lets-icons:expand-right"
                            id="expand-right"
                          />
                        }
                      </div>
                    </div>
                  </div>
                </>
              ) : !selectedAddressPreferences && !selectedObjectPreferences ? (
                <>
                  <div className="emptyRaport-labelFirst">
                    {t('Select a category on the left to view the report')}
                  </div>
                </>
              ) : null}
              {isSmallScreen == true ? (
                <div className="preferenceItems">
                  {selectedAddressPreferences &&
                    Object.entries(custom_addresses).map((address, index) => {
                      const address_name = address[1].address.full;
                      const address_info = address[1];
                      return (
                        <div className="preferenceItem-responsible">
                          <div className="mainItemData">
                            <div className="preferenceAddressItemDistance-without-margin-top">
                              {address_name}
                            </div>
                            <div className="addressDistances-address-responsewness">
                              <div className="address-row">
                                <div className="preferenceAddressItemDistance">
                                  <div className="icon">
                                    <Icon
                                      icon="material-symbols-light:directions-car-outline"
                                      id="person-simple-walk-light"
                                    />
                                  </div>
                                  <div className="distance-time">
                                    <label className="distance">
                                      {address_info.commute_time.bike.distance >
                                      1000
                                        ? `${(
                                            address_info.commute_time.drive
                                              .distance / 1000
                                          ).toFixed(1)} km`
                                        : `${
                                            Math.ceil(
                                              address_info.commute_time.drive
                                                .distance / 10,
                                            ) * 10
                                          } m`}
                                    </label>
                                    <label className="time">
                                      {Math.ceil(
                                        address_info.commute_time.drive
                                          .duration / 60,
                                      )}{' '}
                                      min
                                    </label>
                                  </div>
                                </div>
                                <div className="preferenceAddressItemDistance">
                                  <div className="icon">
                                    <Icon
                                      icon="material-symbols-light:directions-bus-outline"
                                      id="person-simple-walk-light"
                                    />
                                  </div>
                                  <div className="distance-time">
                                    <label className="distance">
                                      {address_info.commute_time.transit
                                        .distance > 1000
                                        ? `${(
                                            address_info.commute_time.transit
                                              .distance / 1000
                                          ).toFixed(1)} km`
                                        : `${
                                            Math.ceil(
                                              address_info.commute_time.transit
                                                .distance / 10,
                                            ) * 10
                                          } m`}
                                    </label>
                                    <label className="time">
                                      {Math.ceil(
                                        address_info.commute_time.transit
                                          .duration / 60,
                                      )}{' '}
                                      min
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="address-row">
                                <div className="preferenceAddressItemDistance">
                                  <div className="icon">
                                    <Icon
                                      icon="ph:person-simple-walk-light"
                                      id="person-simple-walk-light"
                                    />
                                  </div>
                                  <div className="distance-time">
                                    <label className="distance">
                                      {address_info.commute_time.walk.distance >
                                      1000
                                        ? `${(
                                            address_info.commute_time.walk
                                              .distance / 1000
                                          ).toFixed(1)} km`
                                        : `${
                                            Math.ceil(
                                              address_info.commute_time.walk
                                                .distance / 10,
                                            ) * 10
                                          } m`}
                                    </label>
                                    <label className="time">
                                      {Math.ceil(
                                        address_info.commute_time.walk
                                          .duration / 60,
                                      )}{' '}
                                      min
                                    </label>
                                  </div>
                                </div>
                                <div className="preferenceAddressItemDistance">
                                  <div className="icon">
                                    <Icon
                                      icon="ph:person-simple-bike-light"
                                      id="person-simple-walk-light"
                                    />
                                  </div>
                                  <div className="distance-time">
                                    <label className="distance">
                                      {address_info.commute_time.bike.distance >
                                      1000
                                        ? `${(
                                            address_info.commute_time.bike
                                              .distance / 1000
                                          ).toFixed(1)} km`
                                        : `${
                                            Math.ceil(
                                              address_info.commute_time.bike
                                                .distance / 10,
                                            ) * 10
                                          } m`}
                                    </label>
                                    <label className="time">
                                      {Math.ceil(
                                        address_info.commute_time.bike
                                          .duration / 60,
                                      )}{' '}
                                      min
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {selectedObjectPreferences &&
                    allObjects.map((object, index) => {
                      return (
                        <div className="preferenceItem-responsible" key={index}>
                          <div className="mainItemData">
                            <div className="preferenceItemName">
                              {object.name}
                            </div>
                            <div className="preferenceItemAddress">
                              {object.address.full}
                            </div>
                          </div>
                          <div className="preferenceItemDistance">
                            <div className="icon">
                              <Icon
                                icon="ph:person-simple-walk-light"
                                id="person-simple-walk-light"
                              />
                            </div>
                            <div className="distance-time">
                              <label className="distance">
                                {object.distance > 1000
                                  ? `${(object.distance / 1000).toFixed(1)} km`
                                  : `${Math.ceil(object.distance / 10) * 10} m`}
                              </label>
                              <label className="time">
                                {Math.ceil(object.distance / 83)} min
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {!selectedAddressPreferences &&
                    !selectedObjectPreferences &&
                    selectedCategoryPreferences &&
                    Object.keys(selectedCategoryPreferences).map(
                      (category, index) => {
                        const preference = allPreferences.find(
                          (pref) => pref.key === category,
                        );
                        if (preference && preference.value === true) {
                          return Object.values(
                            selectedCategoryPreferences[category],
                          ).map((item, index) => (
                            <div
                              className="preferenceItem-responsible"
                              key={index}
                            >
                              <div className="mainItemData">
                                <div className="preferenceItemName">
                                  {item.name}
                                </div>
                                <div className="preferenceItemAddress">
                                  {item.address.full}
                                </div>
                              </div>
                              <div className="preferenceItemDistance">
                                <div className="icon">
                                  <Icon
                                    icon="ph:person-simple-walk-light"
                                    id="person-simple-walk-light"
                                  />
                                </div>
                                <div className="distance-time">
                                  <label className="distance">
                                    {item.distance > 1000
                                      ? `${(item.distance / 1000).toFixed(
                                          1,
                                        )} km`
                                      : `${
                                          Math.ceil(item.distance / 10) * 10
                                        } m`}
                                  </label>
                                  <label className="time">
                                    {Math.ceil(item.distance / 83)} min
                                  </label>
                                </div>
                              </div>
                            </div>
                          ));
                        } else {
                          return <div key={index}></div>; // Pusty div, jeśli preferencja jest wyłączona
                        }
                      },
                    )}
                </div>
              ) : (
                <div className="preferenceItems">
                  {selectedAddressPreferences &&
                    Object.entries(custom_addresses).map((address, index) => {
                      const address_name = address[1].address.full;
                      const address_info = address[1];
                      return (
                        <div className="preferenceItem">
                          <div className="mainItemData">
                            <div className="preferenceAddressItemDistance">
                              {address_name}
                            </div>
                            <div className="addressDistances">
                              <div className="preferenceAddressItemDistance">
                                <div className="icon">
                                  <Icon
                                    icon="material-symbols-light:directions-car-outline"
                                    id="person-simple-walk-light"
                                  />
                                </div>
                                <div className="distance-time">
                                  <label className="distance">
                                    {address_info.commute_time.bike.distance >
                                    1000
                                      ? `${(
                                          address_info.commute_time.drive
                                            .distance / 1000
                                        ).toFixed(1)} km`
                                      : `${
                                          Math.ceil(
                                            address_info.commute_time.drive
                                              .distance / 10,
                                          ) * 10
                                        } m`}
                                  </label>
                                  <label className="time">
                                    {Math.ceil(
                                      address_info.commute_time.drive.duration /
                                        60,
                                    )}{' '}
                                    min
                                  </label>
                                </div>
                              </div>
                              <div className="preferenceAddressItemDistance">
                                <div className="icon">
                                  <Icon
                                    icon="material-symbols-light:directions-bus-outline"
                                    id="person-simple-walk-light"
                                  />
                                </div>
                                <div className="distance-time">
                                  <label className="distance">
                                    {address_info.commute_time.transit
                                      .distance > 1000
                                      ? `${(
                                          address_info.commute_time.transit
                                            .distance / 1000
                                        ).toFixed(1)} km`
                                      : `${
                                          Math.ceil(
                                            address_info.commute_time.transit
                                              .distance / 10,
                                          ) * 10
                                        } m`}
                                  </label>
                                  <label className="time">
                                    {Math.ceil(
                                      address_info.commute_time.transit
                                        .duration / 60,
                                    )}{' '}
                                    min
                                  </label>
                                </div>
                              </div>
                              <div className="preferenceAddressItemDistance">
                                <div className="icon">
                                  <Icon
                                    icon="ph:person-simple-walk-light"
                                    id="person-simple-walk-light"
                                  />
                                </div>
                                <div className="distance-time">
                                  <label className="distance">
                                    {address_info.commute_time.walk.distance >
                                    1000
                                      ? `${(
                                          address_info.commute_time.walk
                                            .distance / 1000
                                        ).toFixed(1)} km`
                                      : `${
                                          Math.ceil(
                                            address_info.commute_time.walk
                                              .distance / 10,
                                          ) * 10
                                        } m`}
                                  </label>
                                  <label className="time">
                                    {Math.ceil(
                                      address_info.commute_time.walk.duration /
                                        60,
                                    )}{' '}
                                    min
                                  </label>
                                </div>
                              </div>
                              <div className="preferenceAddressItemDistance">
                                <div className="icon">
                                  <Icon
                                    icon="ph:person-simple-bike-light"
                                    id="person-simple-walk-light"
                                  />
                                </div>
                                <div className="distance-time">
                                  <label className="distance">
                                    {address_info.commute_time.bike.distance >
                                    1000
                                      ? `${(
                                          address_info.commute_time.bike
                                            .distance / 1000
                                        ).toFixed(1)} km`
                                      : `${
                                          Math.ceil(
                                            address_info.commute_time.bike
                                              .distance / 10,
                                          ) * 10
                                        } m`}
                                  </label>
                                  <label className="time">
                                    {Math.ceil(
                                      address_info.commute_time.bike.duration /
                                        60,
                                    )}{' '}
                                    min
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {selectedObjectPreferences &&
                    allObjects.map((object, index) => {
                      return (
                        <div className="preferenceItem" key={index}>
                          <div className="mainItemData">
                            <div className="preferenceItemName">
                              {object.name}
                            </div>
                            <div className="preferenceItemAddress">
                              {object.address.full}
                            </div>
                          </div>
                          <div className="preferenceItemDistance">
                            <div className="icon">
                              <Icon
                                icon="ph:person-simple-walk-light"
                                id="person-simple-walk-light"
                              />
                            </div>
                            <div className="distance-time">
                              <label className="distance">
                                {object.distance > 1000
                                  ? `${(object.distance / 1000).toFixed(1)} km`
                                  : `${Math.ceil(object.distance / 10) * 10} m`}
                              </label>
                              <label className="time">
                                {Math.ceil(object.distance / 83)} min
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {!selectedAddressPreferences &&
                    !selectedObjectPreferences &&
                    selectedCategoryPreferences &&
                    Object.keys(selectedCategoryPreferences).map(
                      (category, index) => {
                        const preference = allPreferences.find(
                          (pref) => pref.key === category,
                        );
                        if (preference && preference.value === true) {
                          return Object.values(
                            selectedCategoryPreferences[category],
                          ).map((item, index) => (
                            <div className="preferenceItem" key={index}>
                              <div className="mainItemData">
                                <div className="preferenceItemName">
                                  {item.name}
                                </div>
                                <div className="preferenceItemAddress">
                                  {t(category)}
                                </div>
                                <div className="preferenceItemAddress">
                                  {item.address.full}
                                </div>
                              </div>
                              <div className="preferenceItemDistance">
                                <div className="icon">
                                  <Icon
                                    icon="ph:person-simple-walk-light"
                                    id="person-simple-walk-light"
                                  />
                                </div>
                                <div className="distance-time">
                                  <label className="distance">
                                    {item.distance > 1000
                                      ? `${(item.distance / 1000).toFixed(
                                          1,
                                        )} km`
                                      : `${
                                          Math.ceil(item.distance / 10) * 10
                                        } m`}
                                  </label>
                                  <label className="time">
                                    {Math.ceil(item.distance / 83)} min
                                  </label>
                                </div>
                              </div>
                            </div>
                          ));
                        } else {
                          return <div key={index}></div>; // Pusty div, jeśli preferencja jest wyłączona
                        }
                      },
                    )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="compare-main-div">
            <div class="loader"></div>
          </div>
        )}
        <Footer useMargin={true} />
      </div>
    </div>
  );
}

export default Report;
