const constants = require('../constants');

module.exports = [
    {
        keyword: 'workspace',
        validate: (...[,input]) =>
            typeof input === 'string' && input.includes(constants.WORKSPACES),
        error: {
            message: cxt => cxt.data
        }
    }
];