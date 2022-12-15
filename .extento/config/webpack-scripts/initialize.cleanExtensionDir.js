const fs = require('fs');
const path = require('path');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const cleanExtensionDir = () => {
    if (fs.existsSync(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST)) {
        fs.unlinkSync(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST);
        vLog(`deleted old manifest`);
    }

    fs.readdirSync(constants.PATH_APP_EXTENSION)
        .forEach((filename) => {
            const filepath = path.resolve(constants.PATH_APP_EXTENSION, filename);
            const isClearable = constants.CLEARABLE_PREFIXES
                .some((prefix) => filename.startsWith(prefix));

            if (isClearable) {
                fs.unlinkSync(filepath);
                vLog(`deleted output/${filename}`);
            }
        });

    vLog(`cleaned extension output dir`);
};

module.exports = cleanExtensionDir;
