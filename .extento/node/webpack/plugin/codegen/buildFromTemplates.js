const path = require('path');
const fs = require('fs');
const validate = require('~/node/validate');
const constants = require('~/node/constants');

const formattedSupportedExports = constants.CODE_GEN_LAYER_EXPORTS
    .map((str) => [str.split('.')[0], str]);

const printPluralize = (str) => (str.endsWith('s') ? `${str}es` : `${str}s`);

const padTSNoCheck = (str) => `// @ts-nocheck\n\n${str}`;

const getEnabledLayers = (modName) => {
    const moduleExists = (dir) => fs.existsSync(
        path.resolve(constants.PATH_APP, `layers/${dir}/${modName}`),
    );

    return constants.SELECTIVE_BUILD_LAYERS
        .filter((layer) => moduleExists(layer));
};

const buildLayerExports = () => {
    formattedSupportedExports.forEach(([name, importName = name]) => {
        const requiresExtInImport = importName.endsWith('.json');
        const fixedImportName = requiresExtInImport ? importName : name;

        const enabledLayers = getEnabledLayers(importName);

        const exportContents = validate.templates.layerDefaultExports({
            LAYERS: enabledLayers,
            INTERFACE_NAME: fixedImportName,
        });

        const exportPath = path.resolve(constants.PATH_INTERNAL_COMPILED_REFERENTIAL, `${printPluralize(name)}.ts`);

        fs.writeFileSync(exportPath, padTSNoCheck(exportContents));
    });
};

const buildStateContexts = () => {
    const exportContents = validate.templates.layerStateContexts({
        LAYERS: getEnabledLayers('state.ts'),
    });

    const exportPath = path.resolve(constants.PATH_INTERNAL_COMPILED_REFERENTIAL, 'layerContexts.ts');

    fs.writeFileSync(exportPath, padTSNoCheck(exportContents));
};

const buildTypes = () => {
    const exportContents = validate.templates.types({
        ALL_LAYERS: constants.LAYERS,
        SELECTIVE_BUILD: constants.SELECTIVE_BUILD,
        SELECTIVE_BUILDS: constants.SELECTIVE_BUILDS_CONFIG,
        MANIFEST_V3: require(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST),
        UI_ORDERING: constants.USER_CONFIG.ui_ordering,
    });

    fs.writeFileSync(constants.OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_INDEX, padTSNoCheck(exportContents));
};

const buildPages = () => {
    const { pages = {} } = constants.USER_CONFIG
        .selective_builds[constants.SELECTIVE_BUILD] || {};

    const PAGES = {};
    if (!!pages.Options) {
        PAGES.options = pages.Options;
    }
    if (!!pages.Popup) {
        PAGES.popup = pages.Popup;
    }
    if (!!pages.Tab) {
        PAGES.tab = pages.Tab;
    }
    
    const exportContents = validate.templates.pages({ PAGES });

    fs.writeFileSync(
        path.resolve(constants.PATH_INTERNAL_COMPILED_REFERENTIAL, 'pages.tsx'), 
        padTSNoCheck(exportContents),
    );
};

const buildFromTemplates = () => {
    buildLayerExports();
    buildStateContexts();
    buildTypes();
    buildPages();
};

module.exports = buildFromTemplates;