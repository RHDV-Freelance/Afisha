import * as constants from '../../../constants/types';
import {numberToMonthMap} from "../../../constants/pageData";

type Func = (dates: constants.Date[]) => string;
export const convertDatesToWords: Func = (dates: constants.Date[]) => {
    let hasMonthDuplicates = false;
    let months = dates.map(elem => elem.split('-')[1]);
    if (months.every(month => month === months[0])) hasMonthDuplicates = true;

    const days = dates.map(elem => Number(elem.split('-')[2]));

    return hasMonthDuplicates ?
        [days.join(' - '), numberToMonthMap.get(Number(months[0]))].join(' ')
        :
        months.map((elem, i) =>
        [days[i], numberToMonthMap.get(Number(months[i]))].join(' ')).join(' - ');
}

export const generateRandomNumbers = (from: number, to: number): number[] => {
    let res = [];
    for (let a = Array.from({length: (to - from)}, (_, i) => i + from), i = a.length; i--; ) {
        res.push(a.splice(Math.floor(Math.random() * (i + 1)), 1)[0]);
    }

    return res;
}

export const compareEventDates = (a: constants.Date[], b: constants.Date[]): number => {
    const [dateAStart, dateBStart] = [new Date(a[0]), new Date(b[0])];

    // @ts-ignore
    return dateAStart - dateBStart;
}

export const getFirstUpcomingEvent = (eventList: constants.Event[]): constants.Event => {
    const now = Date.now();

    for (const event of eventList) {
        // @ts-ignore
        if (new Date(event.dates[0]) - now > 0)
            return event;
    }
    return eventList[0];
}