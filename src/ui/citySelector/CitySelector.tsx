import React, {useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import stylesFilters from '../../widgets/filters/styles.module.scss';
import styles from './styles.module.scss';
import './swiperStyles.scss';
import {CustomComponent} from "../../constants/types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getCitySearchResults, selectCities, selectCurrentCity} from "../../app/afishaSlice";
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode} from 'swiper/modules';
import {getCityMap} from "./utils";
import {useSelector} from "react-redux";
import {Drawer, SwipeableDrawer} from "@mui/material";

const CitySelector = ({className}: CustomComponent) => {
    const dispatch = useAppDispatch();
    const allCities = useAppSelector(selectCities);
    const ref = useRef(null as unknown as HTMLInputElement);
    const rootRef = useRef(null as unknown as HTMLDivElement);
    const currentCity = useSelector(selectCurrentCity);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [cities, setCities] = useState(allCities);
    const [cityMap, setCityMap] = useState(getCityMap([...cities].sort()));
    const [searchQuery, setSearchQuery] = useState('');
    const [isOnMobile, setIsOnMobile] = useState(window.innerWidth < 600);

    const togglePopup = () => {
        setIsPopupVisible(prev => !prev);
    }
    const search = (query: string) => {
        if (query.length <= 0) setCities(allCities);
        else setCities(allCities.filter(city => city.toLowerCase().includes(query.toLowerCase())));
        setCityMap(getCityMap([...allCities.filter(city => city.toLowerCase().includes(query.toLowerCase()))].sort()));
    }

    useEffect(() => {
        search(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const checkClickTarget = (e: MouseEvent) => {
            if (e.target !== rootRef.current) setIsPopupVisible(false);
        }
        window.addEventListener('click', checkClickTarget);
        window.addEventListener('resize', () => setIsOnMobile(window.innerWidth < 600))

        return window.removeEventListener('click', checkClickTarget);
    }, [])

    return (
        <div className={styles.root} ref={rootRef}>
            <div className={classNames(stylesFilters.filter, className)} onClick={togglePopup}>
                {currentCity || 'Город'}
            </div>
            {isOnMobile ?
                <SwipeableDrawer
                    anchor={'bottom'}
                    open={isPopupVisible}
                    onOpen={() => setIsPopupVisible(true)}
                    onClose={() => setIsPopupVisible(false)}
                >
                    <div className={styles.popupHeader}>
                        Город
                        <div className={styles.popupHeaderCross} onClick={togglePopup}/>
                    </div>
                    <div className={styles.popupSearchbar}>
                        <div className={styles.magnifyingGlass} onClick={() => setSearchQuery(ref.current.value)}/>
                        <input
                            className={styles.searchbarInput}
                            ref={ref}
                            onInput={() => setSearchQuery(ref.current.value)}
                            placeholder={'Город'}
                        />
                        <div className={styles.searchbarCross} onClick={() => ref.current.value = ''} />
                    </div>
                    <Swiper
                        spaceBetween={5}
                        freeMode={true}
                        modules={[FreeMode]}
                        className="citySwiper"
                    >
                        {cities.map((city, id) => (
                            <SwiperSlide
                                key={id}
                                onClick={() => {
                                    setIsPopupVisible(false);
                                    return dispatch(getCitySearchResults(city));
                                }}
                                className='citySwiperSlide'
                            >
                                {city}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={styles.cityListSelector}>
                        {Array.from(cityMap.entries()).map(([letter, cityList], i) =>
                            <>
                                <div className={styles.cityListLetter}>
                                    {letter}
                                </div>
                                {cityList.map(city => (
                                    <div
                                        className={styles.cityListCity}
                                        onClick={() => {
                                            setIsPopupVisible(false);
                                            dispatch(getCitySearchResults(city));
                                        }}
                                    >
                                        {city}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </SwipeableDrawer> :
                <div className={classNames(styles.citySelectPopup, {[styles.visible]: isPopupVisible})}>
                    <div className={styles.popupHeader}>
                        Город
                        <div className={styles.popupHeaderCross} onClick={togglePopup}/>
                    </div>
                    <div className={styles.popupSearchbar}>
                        <div className={styles.magnifyingGlass} onClick={() => setSearchQuery(ref.current.value)}/>
                        <input
                            className={styles.searchbarInput}
                            ref={ref}
                            onInput={() => setSearchQuery(ref.current.value)}
                            placeholder={'Город'}
                        />
                        <div className={styles.searchbarCross} onClick={() => ref.current.value = ''} />
                    </div>
                    <Swiper
                        spaceBetween={5}
                        freeMode={true}
                        modules={[FreeMode]}
                        className="citySwiper"
                    >
                        {cities.map((city, id) => (
                            <SwiperSlide
                                key={id}
                                onClick={() => {
                                    setIsPopupVisible(false);
                                    return dispatch(getCitySearchResults(city));
                                }}
                                className='citySwiperSlide'
                            >
                                {city}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={styles.cityListSelector}>
                        {Array.from(cityMap.entries()).map(([letter, cityList], i) =>
                            <>
                                <div className={styles.cityListLetter}>
                                    {letter}
                                </div>
                                {cityList.map(city => (
                                    <div
                                        className={styles.cityListCity}
                                        onClick={() => {
                                            setIsPopupVisible(false);
                                            return dispatch(getCitySearchResults(city));
                                        }}
                                    >
                                        {city}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default CitySelector;