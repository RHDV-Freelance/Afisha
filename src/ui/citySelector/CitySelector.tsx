import React, {useRef, useState} from 'react';
import classNames from "classnames";
import stylesFilters from '../../widgets/filters/styles.module.scss';
import styles from './styles.module.scss';
import './swiperStyles.scss';
import {CustomComponent} from "../../constants/types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getCitySearchResults, selectCities} from "../../app/afishaSlice";
import MagnifyingGlass from "../searchBubble/MagnifyingGlass";
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode} from 'swiper/modules';
import {getCityMap} from "./utils";

const CitySelector = ({className}: CustomComponent) => {
    const dispatch = useAppDispatch();
    const allCities = useAppSelector(selectCities);
    const ref = useRef(null as unknown as HTMLInputElement);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [cities, setCities] = useState(allCities);
    const [cityMap, setCityMap] = useState(getCityMap([...cities].sort()));

    const togglePopup = () => {
        setIsPopupVisible(prev => !prev);
    }
    const search = (query: string) => {
        if (query.length > 0) setCities(allCities);
        else setCities(allCities.filter(city => city.toLowerCase().includes(query)));
    }

    return (
        <div className={styles.root}>
            <div className={classNames(stylesFilters.filter, className)} onClick={togglePopup}>
                Город
            </div>
            <div className={classNames(styles.citySelectPopup, {[styles.visible]: isPopupVisible})}>
                <div className={styles.popupHeader}>
                    Город
                </div>
                <div className={styles.popupSearchbar}>
                    <MagnifyingGlass onClick={() => search(ref.current.value)}/>
                    <input ref={ref} onInput={() => search(ref.current.value)}/>
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
                            onClick={() => dispatch(getCitySearchResults(city))}
                            className='citySwiperSlide'
                        >
                            {city}
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Swiper
                    spaceBetween={30}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="cityListSwiper"
                >
                    {Array.from(cityMap.entries()).map(([letter, cityList], i) =>
                        <SwiperSlide key={i}>
                            <div>
                                {letter}
                            </div>
                            {cityList.map(city => (
                                <div>
                                    {city}
                                </div>
                            ))}
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </div>
    );
};

export default CitySelector;