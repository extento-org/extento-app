const fs = require('fs');
const path = require('path');
const resetRequireCache = require('../utils/resetRequireCache');
const { sLog } = require('../utils/logging');
const constants = require('../constants');

const resetSelectiveWorkspaces = () => {
    process.env.SELECTIVE_BUILD = constants.DEFAULT_SELECTIVE_BUILD;

    resetRequireCache();

    // rerun all webpack scripts
    // TODO: does order matter? I don't think so
    fs.readdirSync(constants.PATH_WEBPACK_SCRIPTS)
        .filter((name) => name !== 'index.js')
        .map((name) => path.resolve(constants.PATH_WEBPACK_SCRIPTS, name))
        .forEach(require);

    sLog(`RESET WORKSPACES TO: ${constants.DEFAULT_SELECTIVE_BUILD}`);
};

module.exports = resetSelectiveWorkspaces;
