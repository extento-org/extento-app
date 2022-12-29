const fs = require('fs');
const path = require('path');
const log = require('~/node/log');
const resetRequireCache = require('~/node/utils/resetRequireCache');
const constants = require('~/node/constants');

const resetSelectiveLayers = () => {
    process.env.SELECTIVE_BUILD = constants.DEFAULT_SELECTIVE_BUILD;

    resetRequireCache();

    // rerun all webpack scripts
    // TODO: does order matter? I don't think so
    fs.readdirSync(constants.PATH_WEBPACK_CUSTOM_PLUGIN)
        .filter((name) => name !== 'index.js')
        .filter((name) => fs.statSync(path.resolve(constants.PATH_WEBPACK_CUSTOM_PLUGIN, name)).isFile())
        .map((name) => path.resolve(
            constants.PATH_WEBPACK_CUSTOM_PLUGIN, 
            name,
        ))
        .forEach((_path) => require(_path)());

    log.success(`RESET LAYERS TO: ${constants.DEFAULT_SELECTIVE_BUILD}`);
};

resetSelectiveLayers();
