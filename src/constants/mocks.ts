export const initialApiStateMock = {
    collections: {
        tag: new Map<string, boolean>(),
        feed: {
            city: '',
            coords: [],
            tags: [],
            events: [{
                creation: {
                    name: '',
                    description: '',
                    image: '',
                    url: '',
                },
                place: '',
                dates: [],
                minPrice: '',
                tags: [],
                coords: [],
                city: '',
            }]
        },
        cities: [],
        months: [],
    },
    status: <'idle' | 'loading' | 'failed'>'idle',
    currentMonth: '',
}