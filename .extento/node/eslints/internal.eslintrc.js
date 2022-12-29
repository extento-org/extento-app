const path = require('path');

const sharedRules = {
    'import/no-extraneous-dependencies': [
        'warn',
        {
            devDependencies: true,
            optionalDependencies: true,
            peerDependencies: true,
        },
    ],
    'no-param-reassign': [
        'error',
        {
            props: true,
            ignorePropertyModificationsFor: ['accum'],
        },
    ],
    quotes: 'off', // poorly designed eslint rule in general. see https://github.com/eslint/eslint/issues/5234,
    indent: ['error', 4],
    '@typescript-eslint/indent': ['error', 4],
    'react/jsx-indent': ['error', 4],
    'react/jsx-indent-props': ['error', 4],
};

module.exports = {
    env: {
        node: true,
    },
    extends: ['airbnb'],
    root: true,
    rules: {
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        ...sharedRules,
    },
    ignorePatterns: [
        'codegen/**/*',
        'types/**/*',
        'bridge/**/*',
        'node/**/*',
        'config/**/*',
        'polyfill.js',
    ],
    overrides: [
        {
            extends: ['airbnb', 'airbnb-typescript'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            files: [
                '*.ts',
                '*.tsx',
            ],
            parserOptions: {
                project: [path.resolve(__dirname, 'tsconfig.json')], // Specify it only for TypeScript files
            },
            rules: {
                ...sharedRules,
                'react/jsx-props-no-spreading': 'off',
                'react/no-array-index-key': 'off',
            },
        },
    ],
};
