export const headerText = 'все фестивали лета 2023';
export const afishaEmail = 'info@afisha.ru';
export const feedURL = "https://webwork.fun/get-feed?all=yes";
export const months = [
    'января', 'февраля',
    'марта', 'апреля', 'мая',
    'июня', 'июля', 'августа',
    'сентября', 'октября', 'ноября',
    'декабря',
];
export const monthsNominative = [
    'январь', 'февраль',
    'март', 'апрель', 'май',
    'июнь', 'июль', 'август',
    'сентябрь', 'октябрь', 'ноябрь',
    'декабрь',
];
export const months2monthsMap = new Map([
    ['января', 'январь'], ['февраля', 'февраль'],
    ['марта', 'март'], ['апреля', 'апрель'], ['мая', 'май'],
    ['июня', 'июнь'], ['июля', 'июль'], ['августа', 'август'],
    ['сентября', 'сентабрь'], ['октября', 'октябрь'], ['ноября', 'ноябрь'],
    ['декабря', 'декабрь'],
])
export const numberToMonthMap = new Map(
    Array.from({ length: 12 }, (_, i) => [i + 1, months[i]])
)
// 70 - height, 30 - padding
export const EVENT_ENTRY_SIZE = 70 + 30;