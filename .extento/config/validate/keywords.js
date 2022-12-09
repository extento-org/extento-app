const { WORKSPACES, SELECTIVE_BUILDS } = require('../constants');

module.exports = [
    {
        keyword: 'workspace',
        validate: (...[, input]) => typeof input === 'string' & WORKSPACES.includes(input),
        error: {
            message: cxt => cxt.data
        }
    },
    {
        keyword: 'build',
        validate: (...[, input]) => typeof input === 'string' & SELECTIVE_BUILDS.includes(input),
        error: {
            message: cxt => cxt.data
        }
    }
];
