const fs = require('fs');
const path = require('path');

const { 
    PATH_APP_EXTENSION, 
    OUTPUT_PATH_APP_EXTENSION_MANIFEST, 
    CLEARABLE_PREFIXES, 
} = require('../constants.js');

const main = async () => {
    if (fs.existsSync(OUTPUT_PATH_APP_EXTENSION_MANIFEST)) {
        fs.unlinkSync(OUTPUT_PATH_APP_EXTENSION_MANIFEST);
    }

    fs.readdirSync(PATH_APP_EXTENSION)
        .forEach(filename => {
        if (CLEARABLE_PREFIXES.some(prefix => filename.startsWith(prefix))) {
            fs.unlinkSync(path.resolve(PATH_APP_EXTENSION, filename));
        }
    });
};

main();
