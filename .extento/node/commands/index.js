const childProcess = require('child_process');
const constants = require('~/node/constants');

const _withExecSync = (obj) => Object.entries(obj)
    .reduce((accum, [key, func]) => {
        accum[key] = (...args) => childProcess.execSync(
            func(...args),
            { stdio: 'inherit' },
        );
        return accum;
    }, {});

const DEFAULT_BUILD = constants.DEFAULT_SELECTIVE_BUILD;
const WEBPACK_PROD = constants.PATH_WEBPACK_CONFIG_PROD;
const WEBPACK_DEV = constants.PATH_WEBPACK_CONFIG_DEV;

function compileProd(build) {
    const _build = build || process.env.EXTENTO_SELECTIVE_BUILD || DEFAULT_BUILD;
    return `SELECTIVE_BUILD=${_build} npx webpack --config ${WEBPACK_PROD}`;
};

function compileDev(build) {
    const _build = build || process.env.EXTENTO_SELECTIVE_BUILD || DEFAULT_BUILD;
    return `SELECTIVE_BUILD=${_build} npx webpack --config ${WEBPACK_DEV} --watch`;
};

module.exports = _withExecSync({
    compileProd,
    compileDev,
});
