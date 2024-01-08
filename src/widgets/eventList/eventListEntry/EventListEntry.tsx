import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import styles from './styles.module.scss';
import {CustomComponent, Event} from "../../../constants/types";
import {maxMobileWidth} from "../../../constants/sizes";
import EventIcon from "../eventIcon";
import {convertDatesToWords} from "./utils";
import {useAppDispatch} from "../../../app/hooks";
import {toggleFilter} from "../../../app/afishaSlice";
import {months2monthsMap} from "../../../constants/pageData";

type EventListEntryType = {
    event: Event,
    id: number,
} & CustomComponent

const EventListEntry = ({event, id}: EventListEntryType) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {creation, dates, tags, city} = event;
    const {name, description, image, url} = creation;
    const [isOnMobile, setIsOnMobile] = useState(window.innerWidth < maxMobileWidth);

    useEffect(() => {
        setIsOnMobile(window.innerWidth < maxMobileWidth);
    }, [window.innerWidth]);

    return (
        <div
            className={styles.root}
            data-id={`event-${id}`}
            data-month={
                months2monthsMap.get(convertDatesToWords([dates[dates.length - 1]]).split(' ')[1])
            }
        >
            <div className={styles.eventDates}>
                {isOnMobile ?
                    convertDatesToWords(dates)
                    :
                    dates.map((elem) => Number(elem.split('-')[2])).join('-')}
            </div>
            <EventIcon src={image} className={styles.eventImg}/>
            <div className={styles.eventName} onClick={() => navigate(url)}>
                {name}
            </div>
            <div className={styles.eventCity}>
                {city}
            </div>
            <div className={styles.eventDescription}>
                {description}
                <div className={styles.eventFullDescription}>
                    {description}
                </div>
            </div>
            <div className={styles.eventType}>
                {tags.map((tag, index) => (
                    <p key={index} className={styles.eventTypeText} onClick={() => dispatch(toggleFilter(tag))}>
                        {tag}{index !== tags.length - 1 && ','}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default EventListEntry;