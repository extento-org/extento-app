const { WORKSPACES } = require('../constants');

module.exports = {
    all_workspaces: {
        type: 'array',
        uniqueItems: true,
        maxItems: WORKSPACES.length,
        minItems: WORKSPACES.length,
        items: {
            workspace: true
        }
    },
    some_workspaces: {
        type: 'array',
        uniqueItems: true,
        maxItems: WORKSPACES.length,
        items: {
            workspace: true
        }
    }
};
