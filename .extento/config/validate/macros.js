const constants = require('../constants');
module.exports = {
    all_workspaces: {
        type: 'array',
        uniqueItems: true,
        maxItems: constants.WORKSPACES.length,
        minItems: constants.WORKSPACES.length,
        items: {
            workspace: true
        }
    },
    some_workspaces: {
        type: 'array',
        uniqueItems: true,
        maxItems: constants.WORKSPACES.length,
        items: {
            workspace: true
        }
    }
};
