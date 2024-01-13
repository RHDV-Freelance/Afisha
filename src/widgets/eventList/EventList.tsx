import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.scss';
import EventListEntry from "./eventListEntry";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectCurrentMonth, selectEvents, selectTags, setCurrentMonth} from "../../app/afishaSlice";
import {EVENT_CARD_LINE_INTERVAL} from "../../constants/sizes";
import EventCard from "./eventCard";
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode} from 'swiper/modules';
import {compareEventDates} from "./eventListEntry/utils";

type Props = {
    scrollDirection: 0 | 1,
}
const EventList = ({scrollDirection}: Props) => {
    const dispatch = useAppDispatch();
    const eventList = useAppSelector(selectEvents).events;
    const tagList = useAppSelector(selectTags);
    const [showPastEvents, setShowPartEvents] = useState(false);
    let flag = true;
    const filteredEvents = eventList.filter((event) =>
        Array.from(tagList).filter(elem => elem[1]).length <= 0 ||
        Array.from(tagList.entries()).filter(elem => event.tags.includes(elem[0]) && elem[1]).length > 0

    ).filter(event => {
        // @ts-ignore
        const isUpcoming = new Date(event.dates[0]) - Date.now() > 0;
        if (!isUpcoming && flag) {
            flag = false;
            return true;
        }
        return isUpcoming || showPastEvents;
    });

    // generateRandomNumbers(i * 4, i * 4 + 4)
    const selectedEvents = Array.from(
        {length: Math.floor(eventList.length / EVENT_CARD_LINE_INTERVAL)},
        (_, i) => [i, i, i, i].map((elem, j) => elem * 4 + j)
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
                .some((entry) => {
                const entryMonth = entry.target.getAttribute('data-month') as string;
                if (entry.isIntersecting) {
                    dispatch(setCurrentMonth(entryMonth))
                    return;
                }
            }, {threshold: 1});
        });

        targetSections.forEach((section) => {
            observer.observe(section);
        });
    }, [tagList, showPastEvents, eventList]);

    useEffect(() => setShowPartEvents(false), [tagList]);

    return (
        <div className={styles.root}>
            {!showPastEvents &&
            <div className={styles.pastEvents}>
                <div className={styles.pastEventsText} onClick={() => setShowPartEvents(true)}>
                    ...
                </div>
            </div>}
            {eventList && filteredEvents.map((event, id) => (
                <>
                    {id > 0 && id % EVENT_CARD_LINE_INTERVAL === 0 && (
                        <Swiper
                            spaceBetween={5}
                            freeMode={true}
                            modules={[FreeMode]}
                            className="mySwiper"
                            style={{width: '90%'}}
                        >
                            <div key={'cardLine' + id} className={styles.eventCardLine}>
                                {/* @ts-ignore */}
                                {eventCardsIds.shift().map((event, cardId) => (
                                    <SwiperSlide>
                                        <EventCard key={'card' + cardId} event={event}/>
                                    </SwiperSlide>)
                                )}
                            </div>
                        </Swiper>

                    )}
                    <EventListEntry key={'event' + id} event={event} id={id}/>
                </>
            ))}
        </div>
    );
}

export default EventList;