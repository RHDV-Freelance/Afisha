import {months, months2monthsMap, monthsNominative} from "../../constants/pageData";
import * as constants from "../../constants/pageData";

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