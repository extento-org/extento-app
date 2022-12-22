const fs = require('fs');
const _ = require('lodash');
const log = require('../utils/log');

const constants = require('../constants');

const selectiveBuildCompilerAdjustments = () => {
    const tsconfig = require(constants.PATH_BASE_TSCONFIG);

    const resetExcludePaths = tsconfig.exclude
        .filter((_path) => !_path.startsWith(constants.PATH_APP_LAYERS));
    const includedLayers = constants.LAYERS
        .filter((name) => !constants.SELECTIVE_BUILD_LAYERS.includes(name));

    tsconfig.exclude = _.union(
        resetExcludePaths,
        includedLayers
            .map((name) => `${constants.PATH_APP_LAYERS}/${name}/**/*`),
    );

    fs.writeFileSync(
        constants.PATH_BASE_TSCONFIG,
        JSON.stringify(tsconfig, null, 4),
    );

    log.info(`modified tsconfig to include ${includedLayers.length} layers`);
};

module.exports = selectiveBuildCompilerAdjustments;
