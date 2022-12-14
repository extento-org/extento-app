const path = require('path');

module.exports = {
    env: {
        node: true,
    },
    extends: ['airbnb'],
    root: true,
    rules: {
        indent: ['error', 4],
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        'import/no-extraneous-dependencies': [
            'warn',
            {
                devDependencies: true,
                optionalDependencies: true,
                peerDependencies: true,
            },
        ],
        quotes: 'off', // poorly designed eslint rule in general. see https://github.com/eslint/eslint/issues/5234
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['accum'],
            },
        ],
    },
    overrides: [
        {
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            files: [
                'config/*.ts',
                'config/*.tsx',
            ],
            parserOptions: {
                project: [path.resolve(__dirname, 'tsconfig.json')], // Specify it only for TypeScript files
            },
        },
    ],
};
