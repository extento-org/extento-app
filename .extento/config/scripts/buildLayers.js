const path = require('path');
const log = require('../utils/log');
const getBuildDetails = require('../utils/getBuildDetails');
const resetRequireCache = require('../utils/resetRequireCache');
const zip = require('../utils/zip');
const constants = require('../constants');
const commands = require('../commands');

const isDev = () => process.env.EXTENTO_DEV === 'true';

const packageDistribution = (buildName) => {
    // zip up everything in chrome-v3 and place in our builds folder under the correct name
    const { version } = getBuildDetails(buildName);
    const timestamp = Date.now();
    const suffix = isDev() ? '.DEV' : '.RELEASE';
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
    log.info(`compiled with webpack: ${buildName}`);

    packageDistribution(buildName);
    log.info(`packaged: ${buildName}`);
};

const buildLayers = () => {
    let selectiveBuilds;
    if (process.env.EXTENTO_BUILD_ALL === 'true') {
        selectiveBuilds = constants.SELECTIVE_BUILDS;
    } else {
        selectiveBuilds = [constants.SELECTIVE_BUILD];
    }
    selectiveBuilds.forEach(build);

    require('./resetSelectiveLayers');

    log.success(`completed ${selectiveBuilds.length} builds`);
};

buildLayers();
