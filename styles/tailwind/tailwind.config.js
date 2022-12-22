const withTailwindConfig = require('@extento/node/withTailwindConfig');

module.exports = withTailwindConfig({
    content: [],
    theme: {
        extend: require(`./tailwind.theme.js`),
    },
    corePlugins: {
        aspectRatio: false,
        preflight: true,
    },
    plugins: require(`./tailwind.plugins.js`)
});