const path = require('path');
const { iLog, sLog } = require('../utils/logging');
const getBuildDetails = require('../utils/getBuildDetails');
const resetRequireCache = require('../utils/resetRequireCache');
const zip = require('../utils/zip');
const resetSelectiveWorkspaces = require('./resetSelectiveWorkspaces');
const constants = require('../constants');
const commands = require('../commands');

const packageDistribution = (buildName) => {
    // zip up everything in chrome-v3 and place in our builds folder under the correct name
    const { version } = getBuildDetails(buildName);
    const timestamp = Date.now();
    const suffix = process.env.EXTENTO_DEV === 'true' ? '.DEV' : '.RELEASE';
    const zipFilename = `${version}${suffix}-${timestamp}-${buildName}.zip`;

    zip(
        constants.PATH_APP_EXTENSION,
        path.resolve(constants.PATH_APP_BUILDS, zipFilename),
    );
};

const build = async (buildName) => {
    process.env.SELECTIVE_BUILD = buildName;

    resetRequireCache();

    commands.compile_prod();
    iLog(`compiled with webpack: ${buildName}`);

    packageDistribution(buildName);
    iLog(`packaged: ${buildName}`);
};

const buildWorkspaces = () => {
    let selectiveBuilds;
    if (process.env.EXTENTO_BUILD_ALL === 'true') {
        selectiveBuilds = constants.SELECTIVE_BUILDS;
    } else {
        selectiveBuilds = [constants.SELECTIVE_BUILD];
    }
    selectiveBuilds.forEach(build);

    resetSelectiveWorkspaces();

    sLog(`completed ${selectiveBuilds.length} builds`);
};

buildWorkspaces();
