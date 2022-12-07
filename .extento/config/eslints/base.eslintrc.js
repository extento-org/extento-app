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
      "@typescript-eslint/no-explicit-any": "off",
      "import/prefer-default-export": "off"
    },
    extends: [
      'airbnb',
      'airbnb-typescript'
    ]
};