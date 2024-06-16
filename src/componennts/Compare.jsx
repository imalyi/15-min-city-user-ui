import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Compare.css';
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
import md5 from 'md5';

function Compare() {
  const { i18n, t } = useTranslation();
  const [addresses, setAddresses] = useState('');
  const [report, setReport] = useState({});
  const [requestedObjects, setRequestedObjects] = useState([]);
  const [requestedAddresses, setRequestedAddresses] = useState([]);
  const [requestedCategories, setRequestedCategories] = useState([]);
  const [mainCategoriesToShow, setMainCategoriesToShow] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const categoriesRefs = useRef([]); // Reference to the categories divs

  const location = useLocation();
  const [cookies, setCookie] = useCookies(['userID']);
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userid');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (userId) {
      loadData(userId);
    }
  }, []);

  useEffect(() => {
    // Attach scroll event listeners to each scrollable element
    categoriesRefs.current.forEach((ref, index) => {
      ref.addEventListener('scroll', handleScroll(index));
    });
  }, [addressData]); // Re-attach listeners if addressData changes

  const handleScroll = (index) => (event) => {
    const { scrollTop, scrollLeft } = event.target;

    categoriesRefs.current.forEach((ref, i) => {
      if (i !== index) {
        ref.scrollTop = scrollTop;
        ref.scrollLeft = scrollLeft;
      }
    });
  };

  const setCategoryRef = (element, index) => {
    categoriesRefs.current[index] = element;
  };

  const generateUserID = () => {
    const timestamp = new Date().getTime();
    const randomNumber =
      Math.floor(Math.random() * (999999999 - 1000 + 1)) + 1000;
    const combinedString = timestamp.toString() + randomNumber.toString();
    const userID = md5(combinedString);
    return userID;
  };

  const handleUserReportClick = async (address) => {
    const id = generateUserID();
    saveData(id);
    const reportUrl = `/report?userid=${id}&address=${encodeURIComponent(
      address,
    )}`;
    window.open(reportUrl, '_blank');
  };

  const loadData = async (id) => {
    try {
      const response = await fetch(
        `${api.APP_URL_USER_API}user/load?secret=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.request.addresses);
        setRequestedAddresses(data.request.requested_addresses);
        setRequestedObjects(data.request.requested_objects);
        setRequestedCategories(data.request.categories);
        setReport(data.reports);
        setMainCategoriesToShow(
          Object.keys(data.reports[0].points_of_interest),
        );
        const newAddressData = data.request.addresses.map((address) => {
          const categories = Object.keys(
            data.reports[0].points_of_interest,
          ).map((category) => {
            return {
              name: category,
              percentage: calculatePercentageInCategory(
                address,
                category,
                data.reports,
                data.request.categories,
              ),
            };
          });

          return {
            address,
            categories,
          };
        });
        setAddressData(newAddressData);
        logger.log(newAddressData);
        i18n.changeLanguage(data.language);
      } else {
        console.error('Error getting report:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting report:', error);
    }
  };

  const saveData = async (id) => {
    try {
      const requestBody = {
        secret: id,
        language: i18n.language,
        addresses: addresses,
        categories: requestedCategories,
        requested_objects: requestedObjects,
        requested_addresses: requestedAddresses,
      };
      const response = await fetch(`${api.APP_URL_USER_API}user/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error('Error getting report:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error getting report:', error);
    }
  };

  const getPercentageForAddressAndCategory = (address, category) => {
    const addressEntry = addressData.find((data) => data.address === address);
    if (!addressEntry) return null;

    const categoryEntry = addressEntry.categories.find(
      (cat) => cat.name === category,
    );
    if (!categoryEntry) return null;

    return categoryEntry.percentage;
  };

  const countVisibleCategories = (address) => {
    const foundReport = report.find(
      (report) => report.address.full === address,
    );
    if (!foundReport || !foundReport.points_of_interest) {
      return '0%';
    }
    let totalPlacesCount = 0;
    let totalAddressesCount = 0;

    if (foundReport.custom_objects) {
      Object.values(foundReport.custom_objects).forEach((category) => {
        Object.values(category).forEach((preferences) => {
          totalPlacesCount += preferences.length;
        });
      });
    }
    if (foundReport.custom_addresses) {
      Object.values(foundReport.custom_addresses).forEach((address) => {
        if (
          address.commute_time &&
          address.commute_time.walk &&
          address.commute_time.walk.distance < 3000
        ) {
          totalAddressesCount += 1;
        }
      });
    }

    let categoryCount = 0;

    for (const category in foundReport.points_of_interest) {
      // Sprawdzenie, czy długość tablicy miejsc w danej kategorii jest większa od zera
      for (const interest in foundReport.points_of_interest[category]) {
        if (foundReport.points_of_interest[category][interest].length > 0) {
          categoryCount++; // Zwiększenie licznika, jeśli są jakieś miejsca w kategorii
        }
      }
    }

    let percentage =
      ((categoryCount + totalAddressesCount + totalPlacesCount) /
        (requestedCategories.length +
          requestedAddresses.length +
          requestedObjects.length)) *
      100;

    if (percentage > 100) {
      percentage = 100;
      return `${percentage.toFixed(0)}%`;
    }
    if (isNaN(percentage) || percentage < 0) {
      percentage = 0;
      return `${percentage.toFixed(0)}%`;
    }
    return `${percentage.toFixed(0)}%`;
  };

  const isCategoryPercentageHigher = (address, category) => {
    // Find the entry for the specified address
    const targetAddressEntry = addressData.find(
      (data) => data.address === address,
    );
    if (!targetAddressEntry) return false;

    // Find the category entry for the specified address
    const targetCategoryEntry = targetAddressEntry.categories.find(
      (cat) => cat.name === category,
    );
    if (!targetCategoryEntry) return false;

    // Get the percentage for the specified category at the specified address
    const targetPercentage = parseFloat(targetCategoryEntry.percentage);

    // Compare with the same category at other addresses
    for (const entry of addressData) {
      if (entry.address !== address) {
        const categoryEntry = entry.categories.find(
          (cat) => cat.name === category,
        );
        if (categoryEntry) {
          const percentage = parseFloat(categoryEntry.percentage);
          if (targetPercentage < percentage || targetPercentage == 0) {
            return false; // The target address does not have a higher percentage
          }
        }
      }
    }
    return true; // The target address has a higher percentage than all other addresses
  };

  const calculatePercentageInCategory = (
    address,
    category,
    report,
    requestedCategories,
  ) => {
    logger.log('report', report);
    const foundReport = report.find(
      (report) => report.address.full === address,
    );
    if (!foundReport || !foundReport.points_of_interest) {
      return '0%';
    }
    const placesCounts = {};

    if (foundReport.custom_objects) {
      Object.keys(foundReport.custom_objects).forEach((category) => {
        placesCounts[category] = Object.values(
          foundReport.custom_objects[category],
        ).reduce((total, preferences) => {
          return total + preferences.length;
        }, 0);
      });
    }

    const placesCategoryCount = placesCounts[category] || 0;

    let categoryCount = 0;

    for (const foundReportCategory in foundReport.points_of_interest) {
      // Sprawdzenie, czy długość tablicy miejsc w danej kategorii jest większa od zera
      if (foundReportCategory === category) {
        for (const interest in foundReport.points_of_interest[
          foundReportCategory
        ]) {
          if (
            foundReport.points_of_interest[foundReportCategory][interest]
              .length > 0
          ) {
            categoryCount++; // Zwiększenie licznika, jeśli są jakieś miejsca w kategorii
          }
        }
      }
    }
    const preferencesCategory = requestedCategories.filter(
      (item) => item.main_category === category,
    );

    let countObjects = 0;

    requestedObjects.forEach((object) => {
      if (object.main_category === object.category) {
        countObjects++;
      }
    });

    logger.log(
      categoryCount,
      placesCategoryCount,
      preferencesCategory.length,
      countObjects,
    );

    const percentage =
      ((categoryCount + placesCategoryCount) /
        (preferencesCategory.length + countObjects)) *
      100;

    logger.log('percentage', percentage);

    if (percentage > 100) {
      return '100%';
    } else if (percentage < 0) {
      return '0%';
    } else {
      return `${percentage.toFixed(0)}%`;
    }
  };

  const findNearestPlace = (address, category) => {
    const foundReport = report.find(
      (report) => report.address.full === address,
    );
    if (
      !foundReport ||
      !foundReport.points_of_interest ||
      !foundReport.points_of_interest[category]
    ) {
      return null; // Jeśli nie ma raportu lub brak kategorii "Gastronomia", zwróć null
    }

    const placesInCategoryObj = foundReport.points_of_interest[category];
    const placesInCategory = Object.values(placesInCategoryObj);
    const allPlacesInCategory = placesInCategory.reduce((acc, currentArray) => {
      return acc.concat(currentArray);
    }, []);
    // Jeśli nie ma żadnych miejsc w kategorii, zwróć null
    if (allPlacesInCategory.length === 0) {
      return {
        name: 'No places in category',
        distance: -1,
      };
    }
    // Sortujemy miejsca według odległości
    allPlacesInCategory.sort((a, b) => a.distance - b.distance);
    return {
      name: allPlacesInCategory[0].name,
      distance: allPlacesInCategory[0].distance,
    };
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
        </div>
        {addresses !== '' ? (
          <div
            className={
              addresses.length === 2 || isSmallScreen === false
                ? 'compare-main-div'
                : addresses.length === 3
                  ? 'compare-main-div-3'
                  : ''
            }
          >
            {addresses &&
              addresses.map((address, index) => (
                <div
                  key={index}
                  className={
                    addresses.length === 2
                      ? 'address-div-2'
                      : addresses.length === 3
                        ? 'address-div-3'
                        : ''
                  }
                >
                  <div className="main-info">
                    <div className="address-name">{t(address)}</div>
                    <div className="match-div">
                      {t('Matching')} {countVisibleCategories(address)}
                    </div>
                    <div className="compare-hr-place">
                      <hr className="compare-search-place-hr" />
                    </div>
                  </div>
                  <div
                    className="categories"
                    ref={(el) => setCategoryRef(el, index)}
                  >
                    {mainCategoriesToShow &&
                      mainCategoriesToShow.map((category, index) => (
                        <div key={index}>
                          <div className="compare-category-name">
                            {t(category)}{' '}
                            {getPercentageForAddressAndCategory(
                              address,
                              category,
                            )}
                            {isCategoryPercentageHigher(address, category) ? (
                              <div className="compare-top">
                                <label className="compare-top-label">TOP</label>
                              </div>
                            ) : null}
                          </div>
                          <div
                            className={`${
                              isSmallScreen
                                ? 'nearest-place-resp'
                                : 'nearest-place'
                            }`}
                          >
                            <div className="compare-nearest-place-name">
                              {t(findNearestPlace(address, category).name)}
                            </div>
                            <div className="preference-item-distance">
                              {findNearestPlace(address, category).distance !==
                              -1 ? (
                                <>
                                  <div>
                                    <Icon
                                      icon="ph:person-simple-walk-light"
                                      id="compare-person-simple-walk-light"
                                    />
                                  </div>
                                  <div className="compare-distance-item">
                                    <div className="compare-time">
                                      {Math.ceil(
                                        findNearestPlace(address, category)
                                          .distance / 83,
                                      )}{' '}
                                      min
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div style={{ color: '#dce6fa' }}>
                                    <Icon
                                      icon="ph:person-simple-walk-light"
                                      id="compare-person-simple-walk-light"
                                      style={{ color: '#dce6fa' }}
                                    />
                                  </div>
                                  <div
                                    className="compare-distance-item"
                                    style={{ color: '#dce6fa' }}
                                  >
                                    <div className="compare-time">
                                      {Math.ceil(
                                        findNearestPlace(address, category)
                                          .distance / 83,
                                      )}{' '}
                                      min
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="compare-hr-place" style={{ marginTop: '0' }}>
                    <hr className="compare-search-place-hr" />
                  </div>
                  <div className="compare-button-div">
                    <button
                      className="compare-button-one-address"
                      onClick={() => handleUserReportClick(address)}
                    >
                      {t('See full report')}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="compare-main-div">
            <div className="loader"></div>
          </div>
        )}
        <Footer useMargin={true} />
      </div>
    </div>
  );
}

export default Compare;
