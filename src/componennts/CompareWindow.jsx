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
  addressInput,
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
  const [alarm, setAlarm] = useState('');
  const [cookies, setCookie] = useCookies(['userID']);
  const [isNotAddressLoaded, setIsNotAddressLoaded] = useState(true);
  const userId = cookies.userID;
  const CompareWindowRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (CompareWindowRef.current && !CompareWindowRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [CompareWindowRef]);

  useEffect(() => {
    if (addressesShowData) {
      setAddresses(addressesShowData);
    }
    if (addressesShowData.length === 0 && isNotAddressLoaded) {
      setAddresses([...addressesShowData, addressInput]);
      setIsNotAddressLoaded(false);
    }
  }, [addressesShowData]);

  useEffect(() => {
    const uniqueAddresses = [...new Set(addressesShowData)];
    if (uniqueAddresses.length !== addressesShowData.length || uniqueAddresses.length > 3) {
      setAddresses(uniqueAddresses.slice(0, 3));
      setAddressesShowPage(uniqueAddresses.slice(0, 3));
      setAlarm(t('Duplicate addresses removed or excess addresses trimmed to 3.'));
    }
  }, [addressesShowData, setAddressesShowPage, t]);

  const reportUrl = `/compare?userid=${userId}`;
  const handleCompareButton = () => {
    if (addresses.length < 2) {
      setAlarm(t('You need to add at least 2 addresses to compare them'));
      return;
    } else if (
      selectedPreferences.length === 0 &&
      preferencesSearchData.length === 0
    ) {
      setAlarm(t('Please select at least one preference to compare addresses'));
      return;
    }
    handleUserReportClick();
  };

  const handleUserReportClick = async () => {
    window.open(reportUrl, '_blank');
  };

  const addAddress = (address) => {
    if (addresses.length >= 3) {
      setAlarm(t('You can only add up to 3 addresses'));
      return;
    }
    if (addresses.includes(address)) {
      setAlarm(t('This address is already on the list'));
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
    setIsNotAddressLoaded(false);
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
    setAlarm('');
    setIsResultClicked(false);
  };

  const handleEnterPress = () => {
    setIsResultClicked(true);
    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.click();
      }, 10); // Czas w milisekundach (tutaj 100000ms = 100s)
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" >
      <div className="modal-contents" ref={CompareWindowRef}>
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
                searchResultsListClassName={
                  alarm !== ''
                    ? 'compare-window-search-result-list-with-alert'
                    : 'compare-window-search-result-list'
                }
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
