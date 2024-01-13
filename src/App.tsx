import React, {useEffect, useState} from 'react';
import styles from './app.module.scss';
import placeholder from './assets/images/daily.png';
import Header from "./widgets/header";
import EventList from "./widgets/eventList";
import Filters from "./widgets/filters";
import {useAppDispatch} from "./app/hooks";
import {fetchFeedData} from "./app/afishaSlice";
import Loader from "./ui/loader";
import MonthScroll from "./widgets/monthScroll";
import {enableMapSet} from 'immer';
enableMapSet();

function App() {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const [scrollDirection, setScrollDirection] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    let lastScroll: number | null = null;

    useEffect(() => {
        const handleScroll = (e: Event) => {
            if (lastScroll === null) lastScroll = window.scrollY;
            const currentScroll = window.scrollY || document.documentElement.scrollTop;
            if (currentScroll > lastScroll) setScrollDirection(1);
            else setScrollDirection(0);
            setScrollPosition(currentScroll);
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        }

        window.addEventListener('scroll', handleScroll);

    }, [])

    useEffect(() => {
        dispatch(fetchFeedData()).then(() => setIsLoading(false));
    }, []);

    return (
        <div className={styles.app}>
            <Header />
            {isLoading ? <Loader className={styles.spinner} /> :
                <>
                    <MonthScroll scrollDir={scrollDirection as 0 | 1} scrollPos={scrollPosition} />
                    <img src={placeholder} style={{marginBottom: '20px', minWidth: '100%', minHeight: '450px'}} />
                    <Filters />
                    <EventList scrollDirection={scrollDirection as 0 | 1} />
                </>
            }
        </div>
    );
}

export default App;
