const { PATH_BASE_TSCONFIG } = require('../constants');

module.exports = {
    env: {
        node: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "@typescript-eslint/no-explicit-any": "off"
    },
    parserOptions: {
        project: [PATH_BASE_TSCONFIG], // Specify it only for TypeScript files
    }
};