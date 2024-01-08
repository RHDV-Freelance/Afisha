import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.scss';
import './transitions.scss';
import {selectCurrentMonth} from "../../app/afishaSlice";
import {useAppSelector} from "../../app/hooks";
import {updatePrimaryMonths, updateSecondaryMonths} from "./utils";
import {CSSTransition} from "react-transition-group";
import classNames from "classnames";

const MonthScroll = () => {
    const nodeRefs = useRef({
        current: null,
        upcoming: null,
    });
    const currentMonth = useAppSelector(selectCurrentMonth);
    const [monthsSecondary, setMonthsSecondary] = useState(updateSecondaryMonths(currentMonth));
    const [monthsPrimary, setMonthsPrimary] = useState(updatePrimaryMonths(currentMonth));
    const [isShowingTransition, setIsShowingTransition] = useState(false);
    const [shouldShowNextMonthsState, setShouldShowNextMonthsState] = useState(false);
    const [monthScrollPosition, setMonthScrollPosition] = useState(0);
    const [scrollCoeff, setScrollCoeff] = useState(0.05);

    useEffect(() => {
        setMonthsPrimary(updatePrimaryMonths(currentMonth))
        setMonthsSecondary(updateSecondaryMonths(currentMonth));
        setIsShowingTransition(true);
        console.log(currentMonth, monthsPrimary, monthsSecondary);
    }, [currentMonth]);

    const handleScroll: EventListener = (e) => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        setMonthScrollPosition(prev => prev - document.body.clientWidth / 10 * scrollCoeff);

        setScrollCoeff(prev => prev + 0.05)
        console.log(winScroll);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {passive: true});
        window.addEventListener('click', () => setIsShowingTransition(prev => !prev))

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.monthsSecondary}>
                <div className={styles.monthsPassed}>
                    {monthsSecondary.passed.map((month, id) => (
                        <div key={id}>
                            {month}
                        </div>
                    ))}
                </div>
                <div className={styles.monthsUpcoming}>
                    {monthsSecondary.upcoming.map(month => (
                        <div>
                            {month}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.monthsPrimary}>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={nodeRefs.current}
                    timeout={500}
                    classNames='monthCurrent'
                >
                    <div ref={nodeRefs.current} className='monthCurrent'>
                        {monthsPrimary.current}
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={/* @ts-ignore */
                        nodeRefs.upcoming}
                    onExited={() => setShouldShowNextMonthsState(true)}
                    timeout={1500}
                    classNames='monthUpcoming'
                >

                    <div
                        ref={/* @ts-ignore */
                            nodeRefs.upcoming}
                        className='monthUpcoming'
                        style={{transform: `translateX(${monthScrollPosition}px)`}}
                    >
                        {monthsPrimary.upcoming[0]}
                    </div>
                </CSSTransition>
            </div>
        </div>
    );
};

export default MonthScroll;