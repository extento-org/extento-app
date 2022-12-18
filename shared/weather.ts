export type WeatherTypes = 'RAINY' | 'SUNNY' | 'CLOUDY' | 'LOADING';
export type Colors = '#25316D' | '#FEF5AC' | '#5F6F94' | 'white';

// TODO: find urls we can use to display background images
export const BACKGROUND_COLOR: { [key in WeatherTypes]: Colors } = {
    RAINY: '#25316D',
    SUNNY: '#FEF5AC',
    CLOUDY: '#5F6F94',
    LOADING: 'white'
};

// TODO: write fetch request for weather info, parse it, and convert it to weather status
export async function getBackgroundColor(zipcode: number): Promise<Colors> {
    const localWeatherStatus: WeatherTypes = 'RAINY';

    return BACKGROUND_COLOR[localWeatherStatus];
};