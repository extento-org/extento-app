const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const _ = require('lodash');
const prettier = require('prettier');
const keywords = require('~/node/validate/keywords');
const schemaConfig = require('~/node/validate/schemas/config');

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

const useTemplates = () => {
    const schemaExt = '.schema.js';
    const templateExt = '.template';
    const pathToTemplates = path.resolve(__dirname, 'templates');

    const templates = fs.readdirSync(pathToTemplates)
        .map((_name) => ({
            _path: path.resolve(pathToTemplates, _name),
            _name,
        }))
        .filter(({ _path }) => fs.statSync(_path).isFile())
    
    templates.forEach(({ _path }) => {
        if (_path.endsWith(schemaExt)) {
            const templatePath = _path.split(schemaExt)[0];
            if (!fs.existsSync(templatePath + templateExt)) {
                throw new Error(`${templateName + templateExt} must exist`);
            }
        }
    });

    return templates.reduce((accum, { _name, _path }) => {
        if (_name.endsWith(schemaExt)) {
            const baseName = _name.split(schemaExt)[0];
            const basePath = _path.split(schemaExt)[0];
            accum[baseName] = (data) => {
                throwCheck(
                    require(_path), 
                    data,
                );
                const compiled = _.template(fs.readFileSync(basePath + templateExt, 'utf-8'));
                
                return prettier.format(
                    compiled(data)
                        .replaceAll('\\t', '\t')
                        .replaceAll('\\n', '\n'),
                    { 
                        parser: 'typescript',
                        singleQuote: true,
                        tabWidth: 4,
                    },
                );
            };
        }

        return accum;
    }, {});
};

module.exports = {
    config: (data) => throwCheck(schemaConfig, data),
    templates: useTemplates(),
};
