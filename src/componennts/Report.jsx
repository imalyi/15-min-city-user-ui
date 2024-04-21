import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Report.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { logger } from '../logger';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import anime from 'animejs';


function Report() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const places = location.state?.places || {};
    const address = location.state?.address || 'Unknown Address';
    logger.log(places);
    const categories = Object.keys(places.points_of_interest);
    logger.log(categories);

    const [selectedCategoryPreferences, setselectedCategoryPreferences] = useState(null);
    const [selectedCategory, setselectedCategory] = useState(null);
    

    const handleCategoryClick = (category) => {
        setselectedCategoryPreferences(places.points_of_interest[category]);
        setselectedCategory(category);
    };
    logger.log(selectedCategoryPreferences);

    const [allPreferences, setAllPreferences] = useState(() => {
        // Inicjalizacja stanu allPreferences
        return Object.values(places.points_of_interest).reduce((acc, category) => {
            return acc.concat(Object.entries(category).map(([key]) => ({
                key,
                value: true,
            })));
        }, []);
    });
    console.log(allPreferences);

    const handlePreferencesClick = (category) => {
        // Aktualizacja wartości value na false po kliknięciu
        setAllPreferences(prevPreferences => prevPreferences.map(preference => {
            if (preference.key === category) {
                return { ...preference, value: !preference.value };
            }
            return preference;
        }));
    };

    const scrollToRight = () => {
        const scrollContainer = document.querySelector('.selected-category-label');
        anime({
            targets: scrollContainer,
            scrollLeft: '+=500',
            duration: 500, // Czas trwania animacji w milisekundach
            easing: 'easeInOutQuad' // Rodzaj interpolacji animacji
        });
    };
    
    const scrollToLeft = () => {
        const scrollContainer = document.querySelector('.selected-category-label');
        anime({
            targets: scrollContainer,
            scrollLeft: '-=500',
            duration: 500, // Czas trwania animacji w milisekundach
            easing: 'easeInOutQuad' // Rodzaj interpolacji animacji
        });
    };

    return(
        <div className="report">
            <div className="reportContainer">
                <div className='reportBar'>
                    <div>
                        <Link to="/">
                        <button
                            className="logo"
                            title={t('Search Page')}
                        >
                        <img
                            src={'/images/15min_logo.svg'}
                            alt="Red Cross"
                            className="centered-img-cross"
                        />
                        </button>
                        </Link>
                    </div>
                    <div className='chooseAddress'>
                        <div className='addressName'>{address}</div>
                    </div>
                </div>
                <div className='reportMain'>
                    <div className={categories.length <= 9 ? 'leftReport-short' : 'leftReport'}>

                    {categories && categories.map((category, index) => (
                        <div>
                            <div key={index} className={category === selectedCategory ? 'categoryNameSelected' : 'categoryName'} onClick={() => handleCategoryClick(category)}>
                                <label className='categoryLabel'>{t(category)}</label>
                            </div>
                            <div className={category === selectedCategory ? 'show-data-hr-place-selected' : 'show-data-hr-place'}>
                                <hr className='show-data-search-place-hr'/>
                            </div>
                        </div>
                    ))}

                    </div>
                    <div className='rightReport'>
                        {selectedCategoryPreferences ? (
                            <>
                            <div className='selected-category-container'>
                                <div className="selected-category-label">
                                    <div className="scrollButtonLeft" onClick={scrollToLeft}>                                        
                                        {<Icon icon="lets-icons:expand-left" id='expand-left'/>}
                                    </div>
                                    <div style={{marginLeft: '4vw'}}></div>
                                    {Object.keys(selectedCategoryPreferences).map((category, index) => {
                                        const preference = allPreferences.find(pref => pref.key === category);
                                        const className = preference && preference.value === true ? 'preferenceName' : 'preferenceNameDisabled';
                                        return (
                                            <div className={className} key={index} onClick={() => handlePreferencesClick(category)}>
                                                <label className='preferenceLabel'>
                                                    {t(category)}
                                                </label>
                                            </div>
                                        );
                                    })}
                                    <div style={{marginRight: '4vw'}}></div>
                                    <div className="scrollButtonRight" onClick={scrollToRight}>
                                        {<Icon icon="lets-icons:expand-right" id='expand-right'/>}
                                    </div>
                                </div>
                            </div>
                            <div className='preferenceItems'>
                            {Object.keys(selectedCategoryPreferences).map((category, index) => {
                                const preference = allPreferences.find(pref => pref.key === category);
                                if (preference && preference.value === true) {
                                    return Object.values(selectedCategoryPreferences[category]).map((item, index) => {
                                        return (
                                            <div className='preferenceItem' key={index}>
                                                <div className='mainItemData'>
                                                    <div className='preferenceItemName'>
                                                        {item.name}
                                                    </div>
                                                    <div className='preferenceItemAddress'>
                                                        {item.address.full}
                                                    </div>
                                                </div>
                                                <div className='preferenceItemDistance'>
                                                    <div className='icon'>
                                                        {<Icon icon="ph:person-simple-walk-light" id='person-simple-walk-light'/>}
                                                    </div>
                                                    <div className='distance-time'>
                                                        <label className='distance'>{Math.ceil(item.distance / 10) * 10} m</label>
                                                        <label className='time'>{Math.ceil(item.distance / 83)} min</label>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                } else {
                                    return <div key={index}></div>; // Pusty div, jeśli preferencja jest wyłączona
                                }
                            })}
                            </div>
                            </>
                        ) : (
                            <>
                                <div className='emptyRaport-labelFirst'>{t("Select a category on the left to view the report")}</div>
                            </>
                        )}
                    </div>
                </div>
                <Footer useMargin={true}/>
            </div>
        </div>
    );
}

export default Report;
