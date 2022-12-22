const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const constants = require('../constants');

const cleanExtensionDir = () => {
    if (fs.existsSync(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST)) {
        fs.unlinkSync(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST);
        log.info(`deleted old manifest`);
    }

    fs.readdirSync(constants.PATH_APP_EXTENSION)
        .forEach((filename) => {
            const filepath = path.resolve(constants.PATH_APP_EXTENSION, filename);
            const isClearable = constants.CLEARABLE_PREFIXES
                .some((prefix) => filename.startsWith(prefix));

            if (isClearable) {
                fs.unlinkSync(filepath);
                log.info(`deleted output/${filename}`);
            }
        });

    log.info(`cleaned extension output dir`);
};

module.exports = cleanExtensionDir;
