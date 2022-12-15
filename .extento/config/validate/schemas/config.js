const macros = require('../macros');

module.exports = {
    type: 'object',
    required: [
        'selective_builds',
        'ui_ordering',
        'manifest',
    ],
    properties: {
        manifest: {
            type: 'object',
            required: [
                'name',
                'version',
            ],
            properties: {
                name: {
                    type: 'string',
                },
                version: {
                    type: 'string',
                },
            },
        },
        selective_builds: {
            type: 'object',
            required: [
                'workspaces',
            ],
            properties: {
                workspaces: macros.some_workspaces,
                name: {
                    type: 'string',
                },
                version: {
                    type: 'string',
                },
            },
        },
        ui_ordering: macros.all_workspaces,
    },
};
