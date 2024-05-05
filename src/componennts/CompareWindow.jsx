import React, { useState, useRef, useEffect } from 'react';
import '../styles/CompareWindow.css';
import { useTranslation } from 'react-i18next';
import { SearchBar } from './SearchBar';
import { Icon } from '@iconify/react';
import { SearchResultsList } from './SearchResultsList';
import { logger } from '../logger';
import { useCookies } from 'react-cookie';
import { use } from 'i18next';

const CompareWindow = ({
  isOpen,
  onClose,
  inputShowAddress,
  addressesShowData,
  setInputShowData,
  selectedPreferences,
  transformedPreferences,
  preferencesSearchData,
  handleCompareWindowOpen,
  setAddressesShowPage,
}) => {
  const { i18n, t } = useTranslation();
  const [results, setResults] = useState([]);
  const buttonRef = useRef(null);
  const [input, setInput] = useState('');
  const [isResultClicked, setIsResultClicked] = useState(true);
  const [addresses, setAddresses] = useState(addressesShowData);
  logger.log(addressesShowData);
  const [alarm, setAlarm] = useState('');
  const [cookies, setCookie] = useCookies(['userID']);

  const userId = cookies.userID;

  useEffect(() => {
    if (addressesShowData) {
      setAddresses(addressesShowData);
    }
  }, [addressesShowData]);

  const reportUrl = `/compare?userid=${userId}`;
  logger.log(selectedPreferences, preferencesSearchData);
  const handleCompareButton = () => {
    if (addresses.length < 2) {
      setAlarm('You need to add at least 2 addresses to compare them');
      return;
    } else if(selectedPreferences.length === 0 && preferencesSearchData.length === 0) {
      setAlarm('Please select at least one preference to compare addresses');
      return;
    }
    handleUserReportClick();
  };

  const handleUserReportClick = async () => {
    window.open(reportUrl, '_blank');
  };

  const addAddress = (address) => {
    if (addresses.length >= 3) {
      setAlarm('You can only add up to 3 addresses');
      return;
    }
    if (addresses.includes(address)) {
      setAlarm('This address is already on the list');
      return;
    }
    setAlarm('');
    setAddressesShowPage([...addresses, address]);
    setAddresses([...addresses, address]);
  };

  const onAddressClick = (address) => {
    setInputShowData(address);
    handleEnterPress();
  };

  const handleRemoveAddress = (address) => {
    setAddressesShowPage(addresses.filter((item) => item !== address));
    setAddresses(addresses.filter((item) => item !== address));
  };

  const handleResultClick = (result) => {
    setInput(result);
    setInputShowData(result);
    setIsResultClicked(true);
    addAddress(result);
    handleEnterPress();
    setInput('');
  };

  const handleSearchBarChange = (value) => {
    setInput(value);
    setIsResultClicked(false);
  };

  const handleEnterPress = () => {
    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.click();
      }, 10); // Czas w milisekundach (tutaj 100000ms = 100s)
    }
  };
  logger.log(isResultClicked);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <div className="first-comment">
          {t('Do you have more addresses?')}
          <button className="close-button" onClick={onClose}>
            {' '}
            <Icon icon="material-symbols-light:close" id="close-icon-button" />
          </button>
        </div>
        <div className="second-comment">
          {t(
            'You can conveniently compare them with each other. Use the box below to add a location to the list.',
          )}
        </div>
        <div>
          <SearchBar
            setResults={setResults}
            showDataRef={buttonRef}
            input={input}
            setInput={handleSearchBarChange}
            setIsResultClicked={setIsResultClicked}
            onEnterPress={handleEnterPress}
            searchBarClassName={
              results && results.length > 0 && !isResultClicked
                ? 'border-bottom compare-window-search-bar'
                : 'compare-window-search-bar'
            }
            handleCompareWindowOpen={handleCompareWindowOpen}
            selectedPreferences={selectedPreferences}
            transformedPreferences={transformedPreferences}
            preferencesSearchData={preferencesSearchData}
            ShowDataButtonCompare="alert-none"
            alarm={alarm}
            setAlarm={setAlarm}
          />
          <div style={{ position: 'relative' }}>
            <div className="alarm">{t(alarm)}</div>
            {results && results.length > 0 && !isResultClicked && (
              <SearchResultsList
                results={results}
                onResultClick={handleResultClick}
                searchResultsListClassName="compare-window-search-result-list"
                searchResultsClassName="compare-window-search-list"
              />
            )}
          </div>
        </div>
        <div className="alarm">{t(alarm)}</div>
        <div className="addresses-list">
          {addresses.map((address, index) => (
            <div key={index} className="selected-search-preferences">
              <div
                className="selected-search-address"
                onClick={() => onAddressClick(address)}
              >
                <span className="selected-preference-label">{t(address)}</span>
                <Icon
                  icon="material-symbols-light:close"
                  className="close-icon"
                  onClick={() => handleRemoveAddress(address)}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <button className="compare-button" onClick={handleCompareButton}>
            {t('Compare addresses')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareWindow;
