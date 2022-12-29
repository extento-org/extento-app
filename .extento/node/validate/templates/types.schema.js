const macros = require('~/node/validate/macros');

module.exports = {
    type: 'object',
    required: [
        'ALL_LAYERS',
        'SELECTIVE_BUILD',
        'SELECTIVE_BUILDS',
        'MANIFEST_V3',
        'UI_ORDERING',
    ],
    properties: {
        ALL_LAYERS: macros.all_layers,
        SELECTIVE_BUILD: {
            type: 'string',
        },
        SELECTIVE_BUILDS: {
            type: 'object',
            additionalProperties: {
                type: 'object',
                required: [
                    'layers',
                    'name',
                    'version'
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
        MANIFEST_V3: {
            type: 'object',
            required: [
                'version',
                'name',
                'permissions'
            ],
            properties: {
                version: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                permissions: {
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        chrome_permission: true,
                    },
                },
            }
        },
        UI_ORDERING: macros.all_layers,
    },
};
