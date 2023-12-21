import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShowDataPage.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Map from './Map';
import Footer from './Footer';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { UserLocationButton } from './UserLocationButton';
import ShowDataButton from './ShowDataButton';
import Roles from './Roles';

function ShowDataPage() {
  const [isRolesVisible, setIsRolesVisible] = useState(false);
  const location = useLocation();
  const places = location.state?.places || {};
  console.log(places);
  const address = location.state?.address || 'Unknown Address';
  const addressId = location.state?.addressId || 'Unknown Address';
  const aboutInfo = 'Information from Show-Adresses Component';
  const selectedPreferences = location.state?.selectedPreferences || [];
  const selectedCoordinates = location.state?.selectedCoordinates || [90, 90];
  const [results, setResults] = useState([]);
  const [input, setInput] = useState(address);
  const [addressIdShowPage, setAddressIdShowPage] = useState(addressId);
  const [isResultClicked, setIsResultClicked] = useState(true);
  const [selectedCoordinatesShowPage, setSelectedCoordinatesShowPage] =
    useState(selectedCoordinates);
  const [selectedPreferencesShowPage, setSelectedPreferencesShowPage] =
    useState(selectedPreferences);
  const buttonRef = useRef(null);

  const [flyToLocation, setFlyToLocation] = useState(null);

  const handleDataCategoryClick = (location) => {
    setFlyToLocation(location);
  };

  const handleEnterPress = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const handleResultClick = (result) => {
    setInput(result.address);
    setAddressIdShowPage(result.id);
    setSelectedCoordinatesShowPage([result.location[1], result.location[0]]);
    setIsResultClicked(true);
  };

  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  const handleUserLocationUpdate = (address, lat, lng) => {
    setInput(`${address[0].address}`);
    setAddressIdShowPage(`${address[0].id}`);
    setSelectedCoordinatesShowPage([lat, lng]);
    setIsResultClicked(true);
  };

  const handleToggleRoles = () => {
    setIsRolesVisible((prev) => !prev);
  };

  const handlePreferencesSelect = (preferences) => {
    setSelectedPreferencesShowPage(preferences);
  };

  // Tutaj możesz umieścić kod obsługujący zmiany preferencji lub innych danych
  // Wywołuje się za każdym razem, gdy selectedPreferencesShowPage zostanie zaktualizowane
  const categoriesToShow = selectedPreferences.map((preference) => {
    const formattedPreference = preference
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      key: preference,
      label: formattedPreference,
    };
  });

  // Tutaj możesz coś zrobić z categoriesToShow

  return (
    <div>
      <div className="showDataContainer">
        <div className="ShowDataPage">
          <div className="search-bar-container-show-data">
            <UserLocationButton
              onLocationUpdate={handleUserLocationUpdate}
              onEnterPress={handleEnterPress}
            />
            <div className="column-show-data search-bar-and-results-show-data results-container-show-data">
              <SearchBar
                setResults={setResults}
                input={input}
                setInput={handleSearchBarChange}
                setIsResultClicked={setIsResultClicked}
                onEnterPress={handleEnterPress}
              />
              {results && results.length > 0 && !isResultClicked && (
                <SearchResultsList
                  results={results}
                  onResultClick={handleResultClick}
                />
              )}
            </div>
            <ShowDataButton
              ref={buttonRef}
              address={input}
              addressId={addressIdShowPage}
              selectedPreferences={selectedPreferencesShowPage}
              selectedCoordinates={selectedCoordinatesShowPage}
            />
            <button onClick={handleToggleRoles} className="toggleRolesButton">
              {isRolesVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>
          {isRolesVisible && (
            <div className="how-it-works-container">
              <Roles
                onSelectPreferences={handlePreferencesSelect}
                selectedPreferencesShowPage={selectedPreferencesShowPage}
              />
            </div>
          )}
          <div className="show-data-map">
            <div className="left-section">
              {categoriesToShow.map((category) => (
                <div key={category.key} className="data-category">
                  <h3>{category.label}</h3>
                  {places.osm.points_of_interest[category.key] ? (
                    <div className="no-info-container">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/4315/4315445.png"
                        alt="Red Cross"
                        className="centered-img-tick"
                      />
                    </div>
                  ) : null}
                  {places.osm.points_of_interest[category.key] &&
                  places.osm.points_of_interest[category.key].length > 0 ? (
                    <ul className="data-list">
                      {places.osm.points_of_interest[category.key]?.map(
                        (item, index) => (
                          <li
                            key={index}
                            className="data-list-item"
                            onClick={() =>
                              handleDataCategoryClick(item.location)
                            }
                          >
                            {item.name !== 'unknown' && (
                              <>
                                <strong>Name:</strong> {item.name}
                                <br />
                              </>
                            )}
                            {item.address.full && (
                              <>
                                <strong>Address:</strong> {item.address.full}
                                <br />
                              </>
                            )}
                            <strong>Distance:</strong>{' '}
                            {item.distance < 1000
                              ? `${item.distance.toFixed(0)}m`
                              : `${(item.distance / 1000).toFixed(1)}km`}
                            <br />
                            {item.tags['contact:instagram'] && (
                              <>
                                <strong>Instagram:</strong>{' '}
                                <a href={item.tags['contact:instagram']}>
                                  {item.tags['contact:instagram']}
                                </a>
                                <br />
                              </>
                            )}
                            {item.tags['contact:facebook'] && (
                              <>
                                <strong>Facebook:</strong>{' '}
                                <a href={item.tags['contact:facebook']}>
                                  {item.tags['contact:facebook']}
                                </a>
                                <br />
                              </>
                            )}
                            {item.tags.mobile && (
                              <>
                                <strong>Phone number:</strong>{' '}
                                {item.tags.mobile}
                                <br />
                              </>
                            )}
                            {item.tags['website:menu'] && (
                              <>
                                <strong>Menu:</strong>{' '}
                                <a href={item.tags['website:menu']}>
                                  {item.tags['website:menu']}
                                </a>
                                <br />
                              </>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <div className="no-info-container">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png"
                        alt="Red Cross"
                        className="centered-img-cross"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="right-section map-container">
              <Map
                places={places.osm.points_of_interest}
                categoriesToShow={categoriesToShow.map(
                  (category) => category.key,
                )}
                selectedCoordinatesShowPage={selectedCoordinates}
                flyToLocation={flyToLocation}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer additionalInfo={aboutInfo} />
      </div>
    </div>
  );
}

export default ShowDataPage;