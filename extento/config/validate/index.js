const ajv = require('ajv');

const ajv_instance = new ajv();

keywords.forEach(ajv_instance.addKeyword);

const throw_check = (schema, data) => {
    const validate = ajv.compile(schema);
    
    if (!validate(data)) {
        return new Error(`app manifest validation errors: ${JSON.stringify(validate.errors, null, 2)}`);
    }
};

module.exports = fs.readdirSync(path.resolve(__dirname))
    .filter(name => name !== 'index.js')
    .reduce((accum, file) => {
        const export_name = file.split('.')[0];
        accum[export_name] = data => throw_check(require(`./${file}`), data);
        return accum;
    }, {});
