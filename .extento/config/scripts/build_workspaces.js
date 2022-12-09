const path = require('path');
const get_build_details = require('../utils/get_build_details.js');
const reset_require_cache = require('../utils/reset_require_cache.js');
const zip = require('../utils/zip');
const {
    SELECTIVE_BUILDS,
    PATH_WEBPACK_PRODUCTION,
    SELECTIVE_BUILD,
    PATH_APP_BUILDS,
    PATH_APP_EXTENSION
} = require('../constants');

const package_distribution = async (build_name) => {
    // zip up everything in chrome-v3 and place in our builds folder under the correct name
    const { version } = get_build_details(build_name);
    const timestamp = Date.now();
    const suffix = process.env.EXTENTO_DEV === 'true'
        ? '.DEV'
        : '.RELEASE';
    const zip_filename = version + suffix + '-' + timestamp + '-' + build_name + '.zip';
    zip(PATH_APP_EXTENSION, path.resolve(PATH_APP_BUILDS, zip_filename));
};

const build = async (build_name) => {
    process.env.SELECTIVE_BUILD = build_name;
    reset_require_cache();
    require('child_process').execSync(
        `SELECTIVE_BUILD=${build_name} npx webpack --config ${PATH_WEBPACK_PRODUCTION}`,
        { stdio: 'inherit' }
    );
    package_distribution(build_name);
};

const main = async () => {
    let selective_builds;
    if (process.env.EXTENTO_BUILD_ALL === 'true') {
        selective_builds = SELECTIVE_BUILDS;
    } else {
        selective_builds = [SELECTIVE_BUILD];
    }

    selective_builds.forEach(build);
    
    require('./reset_selective_workspaces.js');
};

main();