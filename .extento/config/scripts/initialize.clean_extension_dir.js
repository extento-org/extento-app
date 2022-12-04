const fs = require('fs');
const path = require('path');
const { CHROME_EXTENSION_PATH, CHROME_EXTENSION_MANIFEST_PATH, CLEARABLE_PREFIXES, } = require('../constants.js');
const main = async (dir, manifest_path) => {
    if (fs.existsSync(manifest_path)) {
        fs.unlinkSync(manifest_path);
    }
    fs.readdirSync(dir)
        .forEach(filename => {
        if (CLEARABLE_PREFIXES.some(prefix => filename.startsWith(prefix))) {
            fs.unlinkSync(path.resolve(dir, filename));
        }
    });
};
main(CHROME_EXTENSION_PATH, CHROME_EXTENSION_MANIFEST_PATH);
