const ajv = require('ajv');

const SCHEMA = {
    type: 'object',
    required: [
        'name',
        'version',
        'use_options',
        'use_popup',
        'allowed_extensions'
    ],
    properties: {
        name: {
            type: 'string'
        },
        version: {
            type: 'string'
        },
        use_options: {
            type: 'boolean'
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
        use_popup: {
            type: 'boolean'
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
};

module.exports = (app_manifest) => {
    const ajv_instance = new ajv();
    const validate = ajv_instance.compile(SCHEMA);
    
    if (!validate(app_manifest)) {
        return new Error(`app manifest validation errors: ${JSON.stringify(validate.errors, null, 2)}`);
    }
};