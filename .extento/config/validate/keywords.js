const constants = require('../constants');

module.exports = [
    {
        keyword: 'workspace',
        validate: (...[, input]) => typeof input === 'string'
            && constants.WORKSPACES.includes(input),
        error: {
            message: (cxt) => cxt.data,
        },
    },
    {
        keyword: 'build',
        validate: (...[, input]) => typeof input === 'string'
            && constants.SELECTIVE_BUILDS.includes(input),
        error: {
            message: (cxt) => cxt.data,
        },
    },
];
