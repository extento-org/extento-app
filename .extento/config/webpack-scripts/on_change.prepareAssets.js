const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const constants = require('../constants');

const prepareAssets = () => {
    constants.ICONS.forEach(({ filepath, name }) => {
        const pathToExtensionIcon = path.resolve(constants.PATH_APP_EXTENSION, name);

        if (!fs.existsSync(pathToExtensionIcon)) {
            fs.copyFileSync(filepath, pathToExtensionIcon);
            log.info(`copied ${name} into output dir`);
        }
    });

    log.info(`prepared extension assets`);
};

module.exports = prepareAssets;
