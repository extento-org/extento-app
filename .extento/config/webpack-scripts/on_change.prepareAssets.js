const fs = require('fs');
const path = require('path');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const prepareAssets = () => {
    constants.ICONS.forEach(({ filepath, name }) => {
        const pathToExtensionIcon = path.resolve(constants.PATH_APP_EXTENSION, name);

        if (!fs.existsSync(pathToExtensionIcon)) {
            fs.copyFileSync(filepath, pathToExtensionIcon);
            vLog(`copied ${name} into output dir`);
        }
    });

    vLog(`prepared extension assets`);
};

module.exports = prepareAssets;
