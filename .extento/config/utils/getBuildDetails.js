const constants = require('../constants');

const getBuildDetails = (build) => {
    const fallbackVersion = constants.USER_CONFIG.manifest.version;
    const fallbackName = `${constants.USER_CONFIG.manifest.name}-${build}`;

    if (build === constants.DEFAULT_SELECTIVE_BUILD) {
        return {
            name: fallbackName,
            version: fallbackVersion,
        };
    }

    return {
        name: constants.USER_CONFIG.selective_builds[build].name
            || fallbackName,
        version: constants.USER_CONFIG.selective_builds[build].version
            || fallbackVersion,
    };
};

module.exports = getBuildDetails;
