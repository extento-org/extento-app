const path = require('path');
const log = require('~/node/log');
const getBuildDetails = require('~/node/utils/getBuildDetails');
const resetRequireCache = require('~/node/utils/resetRequireCache');
const zip = require('~/node/utils/zip');
const constants = require('~/node/constants');
const commands = require('~/node/commands');

const isDev = () => process.env.EXTENTO_DEV === 'true';

const packageDistribution = (build) => {
    // zip up everything in chrome-v3 and place in our builds folder under the correct name
    const { version } = getBuildDetails(build);
    const timestamp = Date.now();
    const suffix = isDev() ? '.DEV' : '.RELEASE';
    const zipFilename = `${version}${suffix}-${timestamp}-${build}.zip`;

    zip(
        constants.PATH_APP_EXTENSION,
        path.resolve(constants.PATH_APP_BUILDS, zipFilename),
    );
};

const build = async (build) => {
    process.env.SELECTIVE_BUILD = build;

    resetRequireCache();

    commands.compileProd(build);
    log.info(`compiled with webpack: ${build}`);

    packageDistribution(build);
    log.info(`packaged: ${build}`);
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
