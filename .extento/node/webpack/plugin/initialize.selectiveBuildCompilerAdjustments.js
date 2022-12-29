const fs = require('fs');
const _ = require('lodash');

const constants = require('~/node/constants');

const selectiveBuildCompilerAdjustments = () => {
    const tsconfig = require(constants.PATH_TSCONFIGS_BASE);

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
        constants.PATH_TSCONFIGS_BASE,
        JSON.stringify(tsconfig, null, 4),
    );
};

module.exports = selectiveBuildCompilerAdjustments;
