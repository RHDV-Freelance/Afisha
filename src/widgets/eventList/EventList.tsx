import React, {useEffect, useRef} from 'react';
import styles from './styles.module.scss';
import EventListEntry from "./eventListEntry";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectCurrentMonth, selectEvents, selectTags, setCurrentMonth} from "../../app/afishaSlice";
import {EVENT_CARD_LINE_INTERVAL} from "../../constants/sizes";
import {generateRandomNumbers} from "./eventListEntry/utils";
import EventCard from "./eventCard";
import {months2monthsMap} from "../../constants/pageData";

const EventList = () => {
    const dispatch = useAppDispatch();
    const eventList = useAppSelector(selectEvents).events;
    const tagList = useAppSelector(selectTags);
    const currentMonth = useAppSelector(selectCurrentMonth);
    const filteredEvents = eventList.filter((event) =>
        Array.from(tagList).filter(elem => elem[1]).length <= 0 ||
        Array.from(tagList.entries()).filter(elem => event.tags.includes(elem[0]) && elem[1]).length > 0
    );

    const selectedEvents = Array.from(
        {length: Math.floor(eventList.length / EVENT_CARD_LINE_INTERVAL)},
        (_, i) => generateRandomNumbers(i * 4, i * 4 + 4)
    );
    const eventCardsIds = Array.from(
        {length: Math.floor(eventList.length / EVENT_CARD_LINE_INTERVAL)}, (_, i) =>
            Array.from({length: 4}, (_, j) =>
                filteredEvents[selectedEvents[i][j]])
    );

    useEffect(() => {
        const targetSections = document.querySelectorAll("[data-id]");

        const observer = new IntersectionObserver((entries) => {
            [...entries]
                .reverse()
                .filter(entry => entry.target.getAttribute('data-month') !== currentMonth)
                .forEach((entry) => {
                const entryMonth = entry.target.getAttribute('data-month') as string;

                if (entry.isIntersecting) {
                    console.log(123, currentMonth, entryMonth)
                    dispatch(setCurrentMonth(entryMonth))
                    return;
                }
            }, {threshold: 0.5});
        });

        targetSections.forEach((section) => {
            observer.observe(section);
        });
    }, [tagList]);

    return (
        <div className={styles.root}>
            {eventList && filteredEvents.map((event, id) => (
                <>
                    {id > 0 && id % EVENT_CARD_LINE_INTERVAL === 0 && (
                        <div key={'cardLine' + id} className={styles.eventCardLine}>
                            {/* @ts-ignore */}
                            {eventCardsIds.shift().map((event, cardId) =>
                                <EventCard key={'card' + cardId} event={event}/>)}
                        </div>
                    )}
                    <EventListEntry key={'event' + id} event={event} id={id}/>
                </>
            ))}
        </div>
    );
}

export default EventList;