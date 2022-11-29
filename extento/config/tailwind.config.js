const constants = require('./constants');

module.exports = {
    content: [
      `${constants.WORKSPACES_PATH}/**/*.{ts,tsx}`,
      `${constants.LIBRARY_PATH}/src/**/*.{ts,tsx}`,
      `${constants.ENTRIES_PATH}/**/*.{ts,tsx}`,
    ],
    theme: {
      extend: require(`${constants.STYLES_PATH}/theme-extension`),
    },
    corePlugins: {
      aspectRatio: false,
      preflight: false,
    },
    plugins: require(`${constants.STYLES_PATH}/plugins`),
  }