const fs = require('fs');
const _ = require('lodash')

const {
    PATH_BASE_TSCONFIG,
    SELECTIVE_BUILD_WORKSPACES,
    WORKSPACES,
    PATH_APP_WORKSPACES
} = require('../constants.js');

const main = async () => {
    const tsconfig = require(PATH_BASE_TSCONFIG);
    tsconfig.exclude = _.union(
        tsconfig.exclude.filter(_path => !_path.startsWith(PATH_APP_WORKSPACES)), 
        WORKSPACES.filter(name => !SELECTIVE_BUILD_WORKSPACES.includes(name))
            .map(name => `${PATH_APP_WORKSPACES}/${name}/**/*`)
    );

    fs.writeFileSync(PATH_BASE_TSCONFIG, JSON.stringify(tsconfig, null, 4));
};

main();