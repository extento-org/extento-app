const fs = require('fs');
const path = require('path');

const constants = require('~/node/constants');

const cleanExtensionDir = () => {
    if (fs.existsSync(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST)) {
        fs.unlinkSync(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST);
    }

    fs.readdirSync(constants.PATH_APP_EXTENSION)
        .forEach((filename) => {
            const filepath = path.resolve(constants.PATH_APP_EXTENSION, filename);
            const isClearable = constants.CLEARABLE_PREFIXES
                .some((prefix) => filename.startsWith(prefix));

            if (isClearable) {
                fs.unlinkSync(filepath);
            }
        });
};

module.exports = cleanExtensionDir;
