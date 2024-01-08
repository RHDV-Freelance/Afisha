import React from 'react';
import './swiperStyles.scss';
import styles from './styles.module.scss';
import classNames from "classnames";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectTags, toggleFilter} from "../../app/afishaSlice";
import SearchBubble from "../../ui/searchBubble";
import CitySelector from "../../ui/citySelector";
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode} from 'swiper/modules';

const Filters = () => {
    const dispatch = useAppDispatch();
    const tags = useAppSelector(selectTags);

    return (
        <>
            <div className={styles.root}>
                <div className={styles.searchSection}>
                    <SearchBubble/>
                    <CitySelector/>
                </div>
                <Swiper
                    spaceBetween={5}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="mySwiper"
                >
                    {Array.from(tags.entries()).map((tagData, id) => (
                            <SwiperSlide
                                key={id}
                                className={classNames({
                                    [styles.filter__active]: tagData[1],
                                    [styles.filter]: true,
                                })}
                                onClick={() => dispatch(toggleFilter(tagData[0]))}
                            >
                                {tagData[0]}
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
            </div>

        </>

    );
};

export default Filters;