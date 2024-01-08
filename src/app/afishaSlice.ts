import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {AfishaState, ApiResponse} from "../constants/types";
import {feedURL, months2monthsMap} from "../constants/pageData";
import {initialApiStateMock} from "../constants/mocks";
import {compareEventDates, convertDatesToWords, getFirstUpcomingEvent} from "../widgets/eventList/eventListEntry/utils";
import {WritableDraft} from 'immer/dist/internal';

const initialState: AfishaState = initialApiStateMock;
let feedCopy: WritableDraft<ApiResponse>;
export const fetchFeedData = createAsyncThunk(
    'counter/fetchCount',
    async () => (
        (await (await fetch(feedURL)).json()) as unknown as ApiResponse
    )
)

export const afishaSlice = createSlice({
    name: 'afisha',
    initialState,
    reducers: {
        toggleFilter: (state, action: PayloadAction<string>) => {
            if (!state.collections.tag.has(action.payload)) state.collections.tag.set(action.payload, false);
            state.collections.tag.set(action.payload, !state.collections.tag.get(action.payload));
        },
        setCurrentMonth: (state, action: PayloadAction<string>) => {
            state.currentMonth = action.payload;
            console.log(state.currentMonth, "<----");
        },
        getSearchResults: (state, action: PayloadAction<string>) => {
            state.collections.feed.events =
                feedCopy.events.filter(({creation}) =>
                    creation.name.toLowerCase().includes(action.payload.toLowerCase()));
        },
        resetSearchResults: (state) => {
            state.collections.feed = structuredClone(feedCopy);
        },
        getCitySearchResults: (state, action: PayloadAction<string>) => {
            state.collections.feed.events =
                feedCopy.events.filter(({city}) =>
                    city.toLowerCase().includes(action.payload.toLowerCase()));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeedData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeedData.fulfilled, (state, action) => {
                state.status = 'idle';
                state.collections.feed = action.payload;
                state.collections.tag = new Map(
                    Array.from(action.payload.tags).map(tagString => [tagString, false])
                );
                state.collections.feed.events.sort((eventA, eventB) => compareEventDates(eventA.dates, eventB.dates));
                state.collections.cities = action.payload.cities ?? ['Москва'];
                state.collections.months = action.payload.events.map(event =>
                    months2monthsMap.get(
                        convertDatesToWords([event.dates[event.dates.length - 1]]).split(' ')[1]) || ''
                );
                state.currentMonth = months2monthsMap.get(convertDatesToWords(
                    [getFirstUpcomingEvent(state.collections.feed.events).dates[0]]
                ).split(' ')[1]) as string;
                feedCopy = structuredClone(state.collections.feed);
            })
            .addCase(fetchFeedData.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const {
    toggleFilter,
    setCurrentMonth,
    getSearchResults,
    resetSearchResults,
    getCitySearchResults
} = afishaSlice.actions;

export const selectTags = (state: RootState) => state.afisha.collections.tag;
export const selectEvents = (state: RootState) => state.afisha.collections.feed;
export const selectMonths = (state: RootState) => state.afisha.collections.months;
export const selectCities = (state: RootState) => state.afisha.collections.cities;
export const selectCurrentMonth = (state: RootState) => state.afisha.currentMonth;

export default afishaSlice.reducer;
