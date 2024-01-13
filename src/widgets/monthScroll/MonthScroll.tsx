import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.scss';
import './transitions.scss';
import {selectCurrentMonth} from "../../app/afishaSlice";
import {useAppSelector} from "../../app/hooks";
import {getMaxBounds, isInBounds, updatePrimaryMonths, updateSecondaryMonths} from "./utils";
import {CSSTransition} from "react-transition-group";
import {maxMobileWidth} from "../../constants/sizes";
import {animationTimeout} from "../../constants/pageData";
import classNames from "classnames";
import {
    motion,
    MotionValue,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform, useVelocity, wrap
} from "framer-motion";

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

type Props = {
    scrollPos: number,
    scrollDir: 0 | 1,
}
const MonthScroll = ({scrollDir, scrollPos}: Props) => {
    const primaryUpcomingRef = useRef(null);
    const primaryCurrentRef = useRef(null);
    const nodeRefs = useRef({
        primary: {
            current: null,
            upcoming: null,
        },
        secondary: {
            passed: null,
            upcoming: null,
        }
    });
    const scrollMonthRef = useRef(null);
    const currentMonth = useAppSelector(selectCurrentMonth);
    const [monthsSecondary, setMonthsSecondary] = useState(updateSecondaryMonths(currentMonth));
    const [monthsPrimary, setMonthsPrimary] = useState(updatePrimaryMonths(currentMonth));
    const [isShowingTransition, setIsShowingTransition] = useState(false);
    const [isOnMobile, setIsOnMobile] = useState(window.innerWidth <= maxMobileWidth);
    const transitionTimeoutHandler = () => {
        setIsShowingTransition(false);
    }
    let transitionTimeout: NodeJS.Timeout;
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 40,
        stiffness: 1000,
        restDelta: 0.001,
    });
    const velocityFactor = useTransform(smoothVelocity, [-1000, 1000], [-1, 1], {
        clamp: true,
    });

    const x = useTransform(baseX, (v) => {
        // @ts-ignore
        if (!isInBounds(primaryCurrentRef, primaryUpcomingRef) && scrollDir == 0) {
            console.log(v)
            // @ts-ignore
            return `${getMaxBounds(primaryCurrentRef, primaryUpcomingRef)}px`;
        }
        return `${v >= 0 ? 0: v}px`;
    });
    useAnimationFrame((t, delta) => {
        let moveBy = -velocityFactor.get() * 5;

        baseX.set(baseX.get() + moveBy);
    });

    useEffect(() => {
        setIsShowingTransition(false);
        clearTimeout(transitionTimeout);

        setMonthsPrimary(updatePrimaryMonths(currentMonth))
        setMonthsSecondary(updateSecondaryMonths(currentMonth));

        setIsShowingTransition(true);
        transitionTimeout = setTimeout(transitionTimeoutHandler, animationTimeout);
        // @ts-ignore
        baseX.set(0); // getMaxBounds(primaryCurrentRef, primaryUpcomingRef)

        console.log(currentMonth, scrollDir);
    }, [currentMonth]);

    useEffect(() => {
        setIsOnMobile(window.innerWidth <= maxMobileWidth);
    }, [window.innerWidth])

    return (
        <div className={styles.root}>
            {!isOnMobile &&
            <div className={styles.monthsSecondary}>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={nodeRefs.current.secondary.passed}
                    timeout={animationTimeout}
                    classNames='secondaryPassedReverse'
                >
                    <div
                        className={classNames(`secondaryPassedReverse${isShowingTransition && 'Anim' || ''}`,
                            styles.monthsPassed)}
                    >
                        {monthsSecondary.passed.map((month, id) => (
                            <div key={id}>
                                {month}
                            </div>
                        ))}
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={nodeRefs.current.secondary.upcoming}
                    timeout={animationTimeout}
                    classNames='secondaryUpcomingReverse'
                >
                    <div
                        className={classNames(`secondaryUpcomingReverse${isShowingTransition && 'Anim' || ''}`,
                            styles.monthsUpcoming)}
                    >
                        {monthsSecondary.upcoming.map(month => (
                            <div>
                                {month}
                            </div>
                        ))}
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={nodeRefs.current.secondary.passed}
                    timeout={animationTimeout}
                    classNames='secondaryPassed'
                >
                    <div
                        className={classNames('secondaryPassedAnim', styles.monthsPassed)}
                        ref={nodeRefs.current.secondary.passed}
                    >
                        {monthsSecondary.passed.map((month, id) => (
                            <div key={id}>
                                {month}
                            </div>
                        ))}
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={nodeRefs.current.secondary.upcoming}
                    timeout={animationTimeout}
                    classNames='secondaryUpcoming'
                >
                    <div
                        className={classNames('secondaryUpcomingAnim', styles.monthsUpcoming)}
                        ref={nodeRefs.current.secondary.upcoming}
                    >
                        {monthsSecondary.upcoming.map(month => (
                            <div>
                                {month}
                            </div>
                        ))}
                    </div>
                </CSSTransition>
            </div>}
            <div className={styles.monthsPrimary}>
                <div className={`monthCurrent ${!isShowingTransition ? 'active' : ''}`}>
                    {monthsPrimary.current}
                </div>
                <motion.div className={`monthUpcoming ${!isShowingTransition && 'active'}`}
                     ref={scrollMonthRef}
                            style={{x}}
                >
                    {monthsPrimary.upcoming[0]}
                </motion.div>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={primaryCurrentRef}
                    timeout={animationTimeout}
                    classNames='monthCurrent'
                >
                    <div className='monthCurrentAnim' ref={primaryCurrentRef}>
                        {monthsPrimary.current}
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={isShowingTransition}
                    nodeRef={primaryUpcomingRef}
                    timeout={animationTimeout}
                    classNames='monthUpcoming'
                >
                    <div className='monthUpcomingAnim' ref={primaryUpcomingRef}>
                        {monthsPrimary.current}
                    </div>
                </CSSTransition>
            </div>
        </div>
    );
};

export default MonthScroll;