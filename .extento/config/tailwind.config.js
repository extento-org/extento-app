const constants = require('./constants');

module.exports = {
    content: [
        `${constants.PATH_APP_WORKSPACES}/**/*.{ts,tsx}`,
        `${constants.PATH_INTERNAL_CORE}/src/**/*.{ts,tsx}`,
        `${constants.PATH_INTERNAL_API}/src/**/*.{ts,tsx}`,
        `${constants.PATH_INTERNAL_ENTRIES}/**/*.{ts,tsx}`,
    ],
    theme: {
        extend: require(`${constants.PATH_APP_STYLES}/theme-extension`),
    },
    corePlugins: {
        aspectRatio: false,
        preflight: false,
    },
    plugins: require(`${constants.PATH_APP_STYLES}/plugins`),
};
