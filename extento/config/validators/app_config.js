const extento_ajv = require('../utils/extento_ajv');

module.exports = (app_config) => {
    const schema = {
        type: 'object',
        required: [
            'selective_builds',
            'ui_ordering'
        ],
        properties: {
            selective_builds: {
                type: 'object',
                additionalProperties: extento_ajv.schemas.some_workspaces
            },
            ui_ordering: extento_ajv.schemas.all_workspaces,
        }
    };

    const validate = extento_ajv._.compile(schema);
    
    if (!validate(app_config)) {
        return new Error(`app config validation errors: ${JSON.stringify(validate.errors, null, 2)}`);
    }
};