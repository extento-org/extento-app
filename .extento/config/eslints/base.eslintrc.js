module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    env: {
      node: true
    },
    root: true,
    ignorePatterns: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    },
    extends: [
      'airbnb',
      'airbnb-typescript'
    ]
};