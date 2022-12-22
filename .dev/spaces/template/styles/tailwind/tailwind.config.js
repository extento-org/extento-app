const path = require('path');
const tailwindThemeReset = require('@extento/node/tailwindThemeReset');

const PATH_APP = path.resolve(__dirname, '..', '..');
const PATH_APP_SHARED = path.resolve(PATH_APP, 'shared');
const PATH_APP_PAGES = path.resolve(PATH_APP, 'pages');
const PATH_APP_LAYERS = path.resolve(PATH_APP, 'layers');
const PATH_INTERNAL_CORE = path.resolve(PATH_APP, '.extento', 'core');
const PATH_INTERNAL_API = path.resolve(PATH_APP, '.extento', 'api');
const PATH_INTERNAL_BRIDGE_ENTRIES = path.resolve(PATH_APP, '.extento', 'entries');

module.exports = {
    content: [
        `${PATH_APP_SHARED}/**/*.{ts,tsx,js,jsx}`,
        `${PATH_APP_PAGES}/**/*.{ts,tsx,js,jsx}`,
        `${PATH_APP_LAYERS}/**/*.{ts,tsx,js,jsx}`,
        `${PATH_INTERNAL_CORE}/src/**/*.{ts,tsx,js,jsx}`,
        `${PATH_INTERNAL_API}/src/**/*.{ts,tsx,js,jsx}`,
        `${PATH_INTERNAL_BRIDGE_ENTRIES}/**/*.{ts,tsx,js,jsx}`,
    ],
    theme: {
        ...tailwindThemeReset,
        extend: require(`./tailwind.theme.js`),
    },
    corePlugins: {
        aspectRatio: false,
        preflight: true,
    },
    plugins: require(`./tailwind.plugins.js`)
};