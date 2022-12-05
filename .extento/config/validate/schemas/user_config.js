const macros = require('../macros');

module.exports = {
    type: 'object',
    required: [
        'selective_builds',
        'ui_ordering'
    ],
    properties: {
        selective_builds: {
            type: 'object',
            additionalProperties: macros.some_workspaces
        },
        ui_ordering: macros.all_workspaces,
    }
};
