const fs = require('fs');

const constants = require('~/node/constants');

const setupAssets = () => {
    constants.ICONS.forEach(({ filepath, name }) => {
        const pathToExtensionIcon = path.resolve(constants.PATH_APP_EXTENSION, name);

        if (!fs.existsSync(pathToExtensionIcon)) {
            fs.copyFileSync(filepath, pathToExtensionIcon);
        }
    });
};

module.exports = setupAssets;
