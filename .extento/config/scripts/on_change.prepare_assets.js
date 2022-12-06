const fs = require('fs');
const path = require('path');

const { 
    ICONS, 
    PATH_APP_EXTENSION 
} = require('../constants.js');

const main = () => {
    ICONS.forEach(({ filepath, name }) => {
        const path_to_extension_icon = path.resolve(PATH_APP_EXTENSION, name);

        if (!fs.existsSync(path_to_extension_icon)) {
            fs.copyFileSync(filepath, path_to_extension_icon);
        }
    });
};

main();
