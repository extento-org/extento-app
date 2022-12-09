const fs = require('fs');
const path = require('path');
const reset_require_cache = require('../utils/reset_require_cache.js');
const {
    DEFAULT_SELECTIVE_BUILD,
    PATH_WEBPACK_SCRIPTS
} = require('../constants.js');

const main = async () => {
    process.env.SELECTIVE_BUILD = DEFAULT_SELECTIVE_BUILD;
    
    reset_require_cache();
    
    // rerun all webpack scripts
    // TODO: does order matter? I don't think so
    fs.readdirSync(PATH_WEBPACK_SCRIPTS)
        .filter(name => name !== 'index.js')
        .map(name => path.resolve(PATH_WEBPACK_SCRIPTS, name))
        .forEach(require);

    console.log(`RESET WORKSPACES TO: ${DEFAULT_SELECTIVE_BUILD}`);
};

main();