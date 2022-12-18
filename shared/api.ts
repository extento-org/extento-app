export type TabWeatherTypes = 'RAINY' | 'SUNNY' | 'CLOUDY';

// TODO: find urls we can use to display background images
export const TAB_BACKGROUNDS: { [key in TabWeatherTypes]: string } = {
    RAINY: '',
    SUNNY: '',
    CLOUDY: '',
};

// TODO: write fetch request for weather info, parse it, and convert it to weather status
export const getWeatherBackgroundPhoto = (zipcode: string) => {
    const localWeatherStatus: TabWeatherTypes = 'RAINY';

    return TAB_BACKGROUNDS[localWeatherStatus];
};