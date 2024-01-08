import React from 'react';
import {Event} from '../../../constants/types';
import styles from './styles.module.scss';
import {convertDatesToWords} from "../eventListEntry/utils";
import {useNavigate} from "react-router-dom";

type Props = {
    event: Event,
}

const EventCard = ({event}: Props) => {
    const {city, creation, dates, minPrice} = event;
    const {name, image, url} = creation;
    const convertedDate = convertDatesToWords(dates);
    const navigate = useNavigate();

    return (
        <div className={styles.root}>
            <div
                className={styles.img}
                onClick={() => navigate(url)}
                style={{backgroundImage: `url(${image})`}}
            >
                {minPrice &&
                <div className={styles.minPriceBubble}>
                    {`от ${minPrice} ₽`}
                </div>}
            </div>
            <div className={styles.eventName}>
                {name}
            </div>
            <div className={styles.dateAndPlace}>
                {`${convertedDate}, ${city}`}
            </div>
        </div>
    );
};

export default EventCard;