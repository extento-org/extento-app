const Ajv = require('ajv');
const keywords = require('./keywords');
const schemaConfig = require('./schemas/config');

const ajvInstance = new Ajv();

keywords.forEach((params) => ajvInstance.addKeyword(params));

const throwCheck = (schema, data) => {
    const validate = ajvInstance.compile(schema);
    if (!validate(data)) {
        return new Error(
            `app manifest validation errors: ${JSON.stringify(validate.errors, null, 4)}`,
        );
    }

    return true;
};

module.exports = {
    config: (data) => throwCheck(schemaConfig, data),
};
