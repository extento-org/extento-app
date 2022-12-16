const path = require('path');
const eslint_base = require('../.extento/config/eslints/.extento.eslintrc.js');

module.exports = {
    ...eslint_base,
    parserOptions: {
        project: [path.resolve(__dirname, 'tsconfig.json')], // Specify it only for TypeScript files
    }
};