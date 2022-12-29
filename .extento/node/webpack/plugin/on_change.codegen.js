const printConstants = require('~/node/webpack/plugin/codegen/printConstants');
const setupAssets = require('~/node/webpack/plugin/codegen/setupAssets');
const buildManifest = require('~/node/webpack/plugin/codegen/buildManifest');
const buildFromTemplates = require('~/node/webpack/plugin/codegen/buildFromTemplates');
const printManifest = require('~/node/webpack/plugin/codegen/printManifest');

const codegen = () => {
    printConstants();
    setupAssets();
    buildManifest();
    printManifest();
    buildFromTemplates();
};

module.exports = codegen;

