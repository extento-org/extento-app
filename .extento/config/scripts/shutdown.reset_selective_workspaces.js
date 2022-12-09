const {
    DEFAULT_SELECTIVE_BUILD,
    PATH_SCRIPT_GEN_MANIFEST,
    PATH_SCRIPT_SELECTIVE_BUILD_COMPILER_ADJUSTMENTS,
    PATH_SCRIPT_GEN_STYLESHEETS,
    PATH_SCRIPT_GEN_TYPES,
    PATH_SCRIPT_GEN_WORKSPACE_MODULES,
    PATH_SCRIPT_PREPARE_ASSETS,
} = require('../constants.js');

const main = async () => {
    process.env.SELECTIVE_BUILD = DEFAULT_SELECTIVE_BUILD;
    Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
    
    const scripts = [
        PATH_SCRIPT_GEN_MANIFEST,
        PATH_SCRIPT_SELECTIVE_BUILD_COMPILER_ADJUSTMENTS,
        PATH_SCRIPT_GEN_STYLESHEETS,
        PATH_SCRIPT_GEN_TYPES,
        PATH_SCRIPT_GEN_WORKSPACE_MODULES,
        PATH_SCRIPT_PREPARE_ASSETS
    ];

    scripts.forEach(require);

    console.log(`RESET WORKSPACES TO: ${DEFAULT_SELECTIVE_BUILD}`);
};

main();