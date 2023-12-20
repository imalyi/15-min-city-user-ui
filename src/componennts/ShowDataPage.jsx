import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShowDataPage.css'; // Dodaj import stylów
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
  const address = location.state?.address || 'Unknown Address';
  const addressId = location.state?.addressId || 'Unknown Address';
  console.log(address);
  const aboutInfo = 'Information from Show-Adresses Component';
  const selectedRole = location.state?.selectedRole || 'Unknown Role';
  const selectedPreferences = location.state?.selectedPreferences || [];
  const selectedCoordinates = location.state?.selectedCoordinates || [90, 90];
  const [results, setResults] = useState([]);
  const [input, setInput] = useState(address);
  const [addressIdShowPage, setAddressIdShowPage] = useState(addressId);
  const [isResultClicked, setIsResultClicked] = useState(true);
  const [selectedCoordinatesShowPage, setSelectedCoordinatesShowPage] =
    useState(selectedCoordinates);
  const [selectedRoleShowPage, setSelectedRoleShowPage] =
    useState(selectedRole);
  const [selectedPreferencesShowPage, setSelectedPreferencesShowPage] =
    useState(selectedPreferences);

  const buttonRef = useRef(null); // Dodaj ref do przycisku

  const handleEnterPress = () => {
    // Po naciśnięciu Enter, naciśnij przycisk ShowDataButton
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

  const handleRoleSelect = (role) => {
    setSelectedRoleShowPage(role);
  };

  const handleToggleRoles = () => {
    // Funkcja do przełączania widoczności komponentu Roles
    setIsRolesVisible((prev) => !prev);
  };

  const handlePreferencesSelect = (preferences) => {
    setSelectedPreferencesShowPage(preferences);
  };

  // Definicja kategorii danych dostępnych dla różnych ról
  const roleCategories = {
    'without role': [
      'bank',
      'bar',
      'cafe',
      'doctors',
      'fast_food',
      'restaurant',
      'school',
      'theatre',
      'police',
    ],
    Student: ['fast_food', 'cafe', 'bar'],
    Pensioner: ['doctors', 'theatre', 'bank', 'restaurant'],
    // Dodaj inne role w miarę potrzeb
  };

  // Wybierz kategorie na podstawie wybranej roli
  const categoriesToShow = roleCategories[selectedRole] || [];
  selectedPreferences.forEach((preference) => {
    if (!categoriesToShow.includes(preference)) {
      categoriesToShow.push(preference);
    }
  });

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
              selectedRole={selectedRoleShowPage}
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
                onSelectRole={handleRoleSelect}
                onSelectPreferences={handlePreferencesSelect}
                selectedRoleFromShowPage={selectedRoleShowPage}
                selectedPreferencesShowPage={selectedPreferencesShowPage}
              />
            </div>
          )}
          <div className="show-data-map">
            <div className="left-section">
              {console.log(places.osm.points_of_interest)}
              {categoriesToShow.map((category) => (
                <div key={category} className="data-category">
                  <h3>{category}</h3>
                  <ul className="data-list">
                    {places.osm.points_of_interest[category]?.map(
                      (item, index) => (
                        <li key={index} className="data-list-item">
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
                              <strong>Phone number:</strong> {item.tags.mobile}
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
                </div>
              ))}
            </div>

            <div className="right-section map-container">
              <Map
                places={places.osm.points_of_interest}
                categoriesToShow={categoriesToShow}
                selectedCoordinatesShowPage={selectedCoordinates}
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
