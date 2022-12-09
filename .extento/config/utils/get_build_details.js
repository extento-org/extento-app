const {
    USER_CONFIG,
    DEFAULT_SELECTIVE_BUILD,
} = require('../constants');

module.exports = (build_name) => {
    const fallback_version = USER_CONFIG.manifest.version;
    const fallback_name = USER_CONFIG.manifest.name + '-' + build_name;

    if (build_name === DEFAULT_SELECTIVE_BUILD) {
        return {
            name: fallback_name, version: fallback_version
        };
    }

    const version = USER_CONFIG.selective_builds[build_name].version
        || fallback_version;
    const name = USER_CONFIG.selective_builds[build_name].name
        || fallback_name;
    
    return {
        name, version
    };
};