export type SVGProps = {
    width?: number,
    height?: number,
}

export type CustomComponent = {
    className?: string,
}

export type Date = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export interface GeneralInfo {
    city: string,
    coords: number[],
    tags: string[],
}

export interface Event extends GeneralInfo{
    creation: {
        name: string,
        description: string,
        image: string,
        url: string,
    },
    place: string,
    dates: Date[],
    minPrice: string,
}

export interface ApiResponse extends GeneralInfo {
    cities?: string[],
    events: Event[],
    time?: number
}

export interface ApiState {
    collections: {
        feed: ApiResponse,
        tag: Map<string, boolean>,
        cities: string[],
        months: string[],
    };
    status: 'idle' | 'loading' | 'failed';
}

export type AfishaState = {
    currentMonth: string,
    currentCity: string,
} & ApiState