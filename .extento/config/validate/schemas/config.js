const macros = require('../macros');

module.exports = {
    type: 'object',
    required: [
        'selective_builds',
        'ui_ordering',
        'manifest'
    ],
    properties: {
        manifest: {
            type: 'object',
            required: [
                'name',
                'version',
                'allowed_extensions'
            ],
            properties: {
                name: {
                    type: 'string'
                },
                version: {
                    type: 'string'
                },
                backgrounds: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                allowed_extensions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string'
                            },
                            version: {
                                type: 'string'
                            }
                        }
                    }
                },
                web_accessible_resources: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                popup_name: {
                    type: 'string'
                },
                permissions: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                content_scripts: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            }
        },
        selective_builds: {
            type: 'object',
            additionalProperties: macros.some_workspaces
        },
        ui_ordering: macros.all_workspaces,
    }
};
