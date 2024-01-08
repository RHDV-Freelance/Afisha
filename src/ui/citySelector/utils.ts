export const getCityMap = (citiesSorted: string[]): Map<string, string[]> => {
    let cityMap = new Map();

    for (let i = 0; i < citiesSorted.length - 1; i++) {
        if (!cityMap.get(citiesSorted[i][0])) cityMap.set(citiesSorted[i][0], [citiesSorted[i]]);
        if (citiesSorted[i][0] === citiesSorted[i + 1][0]) {
            cityMap.set(citiesSorted[i][0], [...cityMap.get(citiesSorted[i][0]), citiesSorted[i + 1]]);
        }
    }
    if (!cityMap.get(citiesSorted[citiesSorted.length - 1][0]))
        cityMap.set(citiesSorted[citiesSorted.length - 1][0], [citiesSorted[citiesSorted.length - 1]]);
    if (citiesSorted[citiesSorted.length - 1][0] === citiesSorted[citiesSorted.length - 2][0]) {
        cityMap.set(citiesSorted[citiesSorted.length - 1][0],
            [...cityMap.get(citiesSorted[citiesSorted.length - 1][0]), citiesSorted[citiesSorted.length - 2]]);
    }

    console.log(citiesSorted, cityMap);

    return cityMap;
}