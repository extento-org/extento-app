const fs = require('fs');

const { APP_CONFIG_PATH, GENERATED_CONFIG_PATH } = require('../constants.js');

const main = async () => {
    fs.writeFileSync(
        GENERATED_CONFIG_PATH, 
        JSON.stringify(require(APP_CONFIG_PATH), null, 2)
    );
};

main();