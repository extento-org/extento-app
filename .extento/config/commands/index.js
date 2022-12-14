const childProcess = require('child_process');
const constants = require('../constants');

const withExecSync = (obj) => Object.entries(obj)
    .reduce(([key, func], accum) => {
        accum[key] = (...args) => childProcess.execSync(
            func(...args),
            { stdio: 'inherit' },
        );
        return accum;
    }, {});

module.exports = withExecSync({
    compile_prod: (
        buildName = constants.DEFAULT_SELECTIVE_BUILD,
    ) => `SELECTIVE_BUILD=${buildName} npx webpack --config ${constants.PATH_WEBPACK_PRODUCTION}`,
});
