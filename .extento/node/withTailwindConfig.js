const _ = require('lodash');
const defaultTheme = require('tailwindcss/defaultTheme');
const constants = require('~/node/constants');

// https://github.com/tailwindlabs/tailwindcss/issues/1232#issuecomment-1330042062
function recursiveConvertRemToPixels(input, fontSize = 16) {
    if (input == null) {
        return input;
    }
    switch (typeof input) {
        case 'object':
            if (Array.isArray(input)) {
                return input.map((val) => recursiveConvertRemToPixels(val, fontSize));
            }
            const ret = {};
            for (const key in input) {
                ret[key] = recursiveConvertRemToPixels(input[key], fontSize);
            }
            return ret;
        case 'string':
            return input.replace(
                /(\d*\.?\d+)rem$/,
                (_, val) => `${parseFloat(val) * fontSize}px`,
            );
        case 'function':
            return eval(input.toString().replace(
                /(\d*\.?\d+)rem/g,
                (_, val) => `${parseFloat(val) * fontSize}px`,
            ));
        default:
            return input;
    }
};

const baseContents = [
    `${constants.PATH_APP_SHARED}/**/*.{ts,tsx,js,jsx}`,
    `${constants.PATH_APP_LAYERS}/**/*.{ts,tsx,js,jsx}`,
    `${constants.PATH_INTERNAL_CORE}/**/*.{ts,tsx,js,jsx}`,
    `${constants.PATH_INTERNAL_BRIDGE}/**/*.{ts,tsx,js,jsx}`,
];

const withTailwindConfig = (userConfig = {}) => {
    _.set(userConfig, 'content', [
        ...baseContents,
        ..._.get(userConfig, 'content', [])
    ]);
    _.set(userConfig, 'theme', {
        ...recursiveConvertRemToPixels(defaultTheme),
        ..._.get(userConfig, 'theme', {})
    });

    return userConfig;
};

module.exports = withTailwindConfig;