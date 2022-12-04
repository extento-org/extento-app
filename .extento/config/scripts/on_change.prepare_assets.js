const fs = require('fs');
const path = require('path');
const { ICONS, CHROME_EXTENSION_PATH } = require('../constants.js');
const main = () => {
    ICONS.forEach(({ filepath, name }) => {
        const path_to_extension_icon = path.resolve(CHROME_EXTENSION_PATH, name);
        if (!fs.existsSync(path_to_extension_icon)) {
            fs.copyFileSync(filepath, path_to_extension_icon);
        }
    });
};
main();
