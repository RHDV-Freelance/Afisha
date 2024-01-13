import {months, months2monthsMap, monthsNominative} from "../../constants/pageData";
import * as constants from "../../constants/pageData";
import React from "react";

type secondaryUpdateFunc = {
    passed: (string | undefined)[],
    upcoming: (string | undefined)[],
}
export const updateSecondaryMonths = (currentMonth: string): secondaryUpdateFunc => {
    return {
        passed: Array.from({length: 3}, (_, i) =>
            months2monthsMap.get(
                months[monthsNominative.indexOf(currentMonth) - i - 1]
            )),
        upcoming: Array.from({length: 3}, (_, i) =>
            months2monthsMap.get(
                months[monthsNominative.indexOf(currentMonth) + i + 2]
            )),
    }
}

type primaryUpdateFunc = {
    current: string,
    upcoming: (string | undefined)[],
}
export const updatePrimaryMonths = (currentMonth: string): primaryUpdateFunc => {
    return {
        current: currentMonth,
        upcoming: Array.from({length: 3}, (_, i) =>
            constants.months2monthsMap.get(
                constants.months[constants.monthsNominative.indexOf(currentMonth) + i + 1]
            )),
    }
}

type BoundsArgs = {
    currentRef: React.MutableRefObject<HTMLDivElement>,
    upcomingRef: React.MutableRefObject<HTMLDivElement>
}
type BoundsFunc = (
    current: BoundsArgs['currentRef'],
    upcoming: BoundsArgs['upcomingRef'],
) => boolean;
export const isInBounds: BoundsFunc = (
    currentRef,
    upcomingRef
) => {
    if (!currentRef.current || !upcomingRef.current)
        return false;
    const {x, width} = currentRef.current.getBoundingClientRect();
    return (x + width) <
        (upcomingRef.current.getBoundingClientRect().x + upcomingRef.current.getBoundingClientRect().width);
}

type MaxBoundsFunc = (
    current: BoundsArgs['currentRef'],
    upcoming: BoundsArgs['upcomingRef'],
) => number;
export const getMaxBounds: MaxBoundsFunc = (
    primary, upcoming
) => {
    if (!primary.current || !upcoming.current)
        return 0;
    const {x, width} = primary.current.getBoundingClientRect();
    return x + width - window.innerWidth + upcoming.current.getBoundingClientRect().width;
}