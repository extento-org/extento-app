const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const constants = require('../config/constants');

const plugins = [];

const PATH_TO_TAILWIND_CONFIG = path.resolve(constants.PATH_APP_STYLES, 'tailwind', 'tailwind.config.js');

if (fs.existsSync(PATH_TO_TAILWIND_CONFIG)) {
    plugins.push({ 
        tailwindcss: { config: PATH_TO_TAILWIND_CONFIG } 
    });
}

plugins.push({
    autoprefixer: {}
});

const withPostcss = (userConfig = {}) => {
    let finalPlugins;
    const userPlugins = _.get(userConfig, 'plugins', {});

    if (Array.isArray(userPlugins)) {
        finalPlugins = plugins.concat(userPlugins);
    } else {
        finalPlugins = {
            ...Object.assign({}, ...plugins),
            ...userPlugins
        };
    }

    _.set(userConfig, 'plugins', finalPlugins);

    return userConfig;
};

module.exports = withPostcss;