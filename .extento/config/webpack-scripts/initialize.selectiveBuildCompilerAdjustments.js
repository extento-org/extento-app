const fs = require('fs');
const _ = require('lodash');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const selectiveBuildCompilerAdjustments = () => {
    const tsconfig = require(constants.PATH_BASE_TSCONFIG);

    const resetExcludePaths = tsconfig.exclude
        .filter((_path) => !_path.startsWith(constants.PATH_APP_WORKSPACES));
    const includedWorkspaces = constants.WORKSPACES
        .filter((name) => !constants.SELECTIVE_BUILD_WORKSPACES.includes(name));

    tsconfig.exclude = _.union(
        resetExcludePaths,
        includedWorkspaces
            .map((name) => `${constants.PATH_APP_WORKSPACES}/${name}/**/*`),
    );

    fs.writeFileSync(
        constants.PATH_BASE_TSCONFIG,
        JSON.stringify(tsconfig, null, 4),
    );

    vLog(`modified tsconfig to include ${includedWorkspaces.length} workspaces`);
};

module.exports = selectiveBuildCompilerAdjustments;
