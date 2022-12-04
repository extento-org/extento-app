const ajv = require('ajv');
const shared = require('../shared');

const ajv_instance = new ajv();

const workspaces = shared.get_workspace_dirs();

ajv_instance.addKeyword({
    keyword: 'workspace',
    validate: (...[,input]) =>
        typeof input === 'string' && input.includes(workspaces),
    error: {
        message: cxt => cxt.data
    }
});

module.exports = {
    _: ajv_instance,
    schemas: {
        all_workspaces: {
            type: 'array',
            uniqueItems: true,
            maxItems: workspaces.length,
            minItems: workspaces.length,
            items: {
                workspace: true
            }
        },
        some_workspaces: {
            type: 'array',
            uniqueItems: true,
            maxItems: workspaces.length,
            items: {
                workspace: true
            }
        }
    }
};