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

    useEffect(() => {
        dispatch(fetchFeedData()).then(() => setIsLoading(false));
    }, [])

    return (
        <div className={styles.app}>
            <Header />
            {isLoading ? <Loader className={styles.spinner} /> :
                <>
                    <MonthScroll />
                    <img src={placeholder} style={{marginBottom: '20px', width: '100%'}} />
                    <Filters />
                    <EventList />
                </>
            }
        </div>
    );
}

export default App;
