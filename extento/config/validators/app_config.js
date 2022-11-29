const shared = require('../shared');
const ajv = require('ajv');

module.exports = (app_config) => {
    const workspaces = shared.get_workspace_dirs();
    const schema = {
        type: "object",
        required: [
            "order",
            "source_repo",
            "source_commit_hash"
        ],
        properties: {
            source_repo: {
                type: "string"
            },
            source_commit_hash: {
                type: "string"
            },
            order: {
                type: "object",
                required: workspaces,
                properties: workspaces.reduce((accum, workspace) => {
                    accum[workspace] = {
                        type: "number"
                    }
                    return accum;
                }, {})
            }
        }
    };

    const ajv_instance = new ajv();
    const validate = ajv_instance.compile(schema);
    
    if (!validate(app_config)) {
        return new Error(`app config validation errors: ${JSON.stringify(validate.errors, null, 2)}`);
    }
};