const fs = require('fs');

const {
    PATH_BASE_TSCONFIG,
    SELECTIVE_BUILD_WORKSPACES,
    WORKSPACES
} = require('../constants.js');

const main = async () => {
    const tsconfig = require(PATH_BASE_TSCONFIG);
    tsconfig.exclude = tsconfig.exclude.concat(
        WORKSPACES.filter(name => !SELECTIVE_BUILD_WORKSPACES.includes(name))
            .map(name => `${PATH_APP_WORKSPACES}/${name}/**/*`)
    );

    fs.writeFileSync(PATH_BASE_TSCONFIG, JSON.stringify(tsconfig, null, 2));
};

main();