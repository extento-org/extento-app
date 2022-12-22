const fs = require('fs');
const path = require('path');
const resetRequireCache = require('../utils/resetRequireCache');
const log = require('../utils/log');
const constants = require('../constants');

const resetSelectiveLayers = () => {
    process.env.SELECTIVE_BUILD = constants.DEFAULT_SELECTIVE_BUILD;

    resetRequireCache();

    // rerun all webpack scripts
    // TODO: does order matter? I don't think so
    fs.readdirSync(constants.PATH_WEBPACK_SCRIPTS)
        .filter((name) => name !== 'index.js')
        .map((name) => path.resolve(constants.PATH_WEBPACK_SCRIPTS, name))
        .forEach((_path) => require(_path)());

    log.success(`RESET LAYERS TO: ${constants.DEFAULT_SELECTIVE_BUILD}`);
};

resetSelectiveLayers();
