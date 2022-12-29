const macros = require('~/node/validate/macros');

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
            additionalProperties: {
                type: 'object',
                required: [
                    'layers',
                ],
                properties: {
                    layers: macros.some_layers,
                    name: {
                        type: 'string',
                    },
                    version: {
                        type: 'string',
                    },
                },
            }
        },
        ui_ordering: macros.all_layers,
    },
};
