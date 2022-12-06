const ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const keywords = require('./keywords');
const ajv_instance = new ajv();

keywords.forEach(params => ajv_instance.addKeyword(params));

const throw_check = (schema, data) => {
    const validate = ajv_instance.compile(schema);
    if (!validate(data)) {
        return new Error(
            `app manifest validation errors: ${JSON.stringify(validate.errors, null, 2)}`
        );
    }
};

module.exports = fs.readdirSync(path.resolve(__dirname, 'schemas'))
    .filter(name => name !== 'index.js')
    .reduce((accum, file) => {
        const export_name = file.split('.')[0];
        accum[export_name] = data => throw_check(require(`./schemas/${file}`), data);
        
        return accum;
    }, {});
