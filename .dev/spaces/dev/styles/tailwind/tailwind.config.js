const path = require('path');

const PATH_APP = path.resolve(__dirname, '..', '..');
const PATH_APP_PAGES = path.resolve(PATH_APP, 'pages');
const PATH_APP_LAYERS = path.resolve(PATH_APP, 'layers');
const PATH_INTERNAL_CORE = path.resolve(PATH_APP, '.extento', 'core');
const PATH_INTERNAL_API = path.resolve(PATH_APP, '.extento', 'api');
const PATH_INTERNAL_ENTRIES = path.resolve(PATH_APP, '.extento', 'entries');

module.exports = {
    content: [
        `${PATH_APP_PAGES}/**/*.{ts,tsx,js,jsx}`,
        `${PATH_APP_LAYERS}/**/*.{ts,tsx,js,jsx}`,
        `${PATH_INTERNAL_CORE}/src/**/*.{ts,tsx,js,jsx}`,
        `${PATH_INTERNAL_API}/src/**/*.{ts,tsx,js,jsx}`,
        `${PATH_INTERNAL_ENTRIES}/**/*.{ts,tsx,js,jsx}`,
    ],
    theme: {
        extend: require(`./tailwind.theme.js`),
    },
    corePlugins: {
        aspectRatio: false,
        preflight: false,
    },
    plugins: require(`./tailwind.plugins.js`),
};