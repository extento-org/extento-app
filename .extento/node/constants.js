const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const throwOnNonExistence = require('~/node/utils/throwOnNonExistence');
const formatDomSelector = require('~/node/utils/formatDomSelector');

const PATH_APP = path.resolve(__dirname, '..', '..');
const PATH_APP_BUILDS = path.resolve(PATH_APP, 'builds');
const PATH_APP_EXTENSION = path.resolve(PATH_APP, 'chrome-v3');
const PATH_APP_LAYERS = path.resolve(PATH_APP, 'layers');
const PATH_APP_POSTCSS = path.resolve(PATH_APP, 'postcss.js');
const PATH_APP_SHARED = path.resolve(PATH_APP, 'shared');
const PATH_APP_STYLES = path.resolve(PATH_APP, 'styles');
const PATH_INTERNAL = path.resolve(__dirname, '..');
const PATH_INTERNAL_BRIDGE = path.resolve(PATH_INTERNAL, 'bridge');
const PATH_INTERNAL_BRIDGE_ENTRIES = path.resolve(PATH_INTERNAL_BRIDGE, 'entries');
const PATH_INTERNAL_BRIDGE_ENTRIES_BACKGROUND = path.resolve(PATH_INTERNAL_BRIDGE_ENTRIES, 'background.ts');
const PATH_INTERNAL_BRIDGE_ENTRIES_CONTENT_SCRIPT = path.resolve(PATH_INTERNAL_BRIDGE_ENTRIES, 'content_script.ts');
const PATH_INTERNAL_BRIDGE_ENTRIES_ONLOAD = path.resolve(PATH_INTERNAL_BRIDGE_ENTRIES, 'onload.ts');
const PATH_INTERNAL_BRIDGE_ENTRIES_PAGES = path.resolve(PATH_INTERNAL_BRIDGE_ENTRIES, 'pages.tsx');
const PATH_INTERNAL_BRIDGE_ENTRIES_PAGES_HTML = path.resolve(PATH_INTERNAL_BRIDGE_ENTRIES, 'pages.html');
const PATH_INTERNAL_BRIDGE_ENTRIES_UI = path.resolve(PATH_INTERNAL_BRIDGE_ENTRIES, 'ui.tsx');
const PATH_INTERNAL_COMPILED = path.resolve(PATH_INTERNAL, '.compiled');
const PATH_INTERNAL_COMPILED_PUBLIC = path.resolve(PATH_INTERNAL_COMPILED, 'public');
const PATH_INTERNAL_COMPILED_REFERENTIAL = path.resolve(PATH_INTERNAL_COMPILED, 'bridge');
const PATH_INTERNAL_CORE = path.resolve(PATH_INTERNAL, 'core');
const PATH_TSCONFIGS = path.resolve(__dirname, 'tsconfigs');
const PATH_TSCONFIGS_BASE = path.resolve(PATH_TSCONFIGS, 'base.json');
const PATH_TSCONFIGS_WEBPACK = path.resolve(PATH_TSCONFIGS, 'webpack.json');
const PATH_WEBPACK = path.resolve(__dirname, 'webpack');
const PATH_WEBPACK_CONFIG_DEV = path.resolve(PATH_WEBPACK, 'config.dev.js');
const PATH_WEBPACK_CONFIG_PROD = path.resolve(PATH_WEBPACK, 'config.prod.js');
const PATH_WEBPACK_CUSTOM_PLUGIN = path.resolve(PATH_WEBPACK, 'plugin');
const PATH_WEBPACK_SHARED = path.resolve(PATH_WEBPACK, 'shared');
const PATH_WEBPACK_SHARED_STYLE_RULES = path.resolve(PATH_WEBPACK_SHARED, 'styleRules.js');

const OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_CONSTANTS = path.resolve(PATH_INTERNAL_COMPILED_PUBLIC, 'constants.ts');
const OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_INDEX = path.resolve(PATH_INTERNAL_COMPILED_PUBLIC, 'index.ts');
const OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_MANIFEST = path.resolve(PATH_INTERNAL_COMPILED_PUBLIC, 'manifest.ts');
const OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_PAGES = path.resolve(PATH_INTERNAL_COMPILED_PUBLIC, 'pages.ts');

const OUTPUT_PATH_APP_EXTENSION_MANIFEST = path.resolve(PATH_APP_EXTENSION, 'manifest.json');

const PACKAGE_JSON = require(path.resolve(PATH_APP, 'package.json'));

const { extento: USER_CONFIG } = PACKAGE_JSON;

// a list of files we want to aggregate in codegen
const CODE_GEN_LAYER_EXPORTS = [
    'worker.ts',
    'contentScript.ts',
    'manifest.json',
    'onload.ts',
    'ui',
    'state.ts',
    'workerApi.ts',
    'worker.ts',
];

// never change to dot file
const PREFIX_DIST = 'EXT_DIST.built.';
const PREFIX_ICON = 'icon_';
const CLEARABLE_PREFIXES = [PREFIX_DIST, PREFIX_ICON];

// extension dist files
const DIST_BACKGROUND = `${PREFIX_DIST}background.js`;
const DIST_CONTENT_SCRIPT = `${PREFIX_DIST}content_script.js`;
const DIST_ONLOAD = `${PREFIX_DIST}onload.js`;
const DIST_PAGES_HTML = `${PREFIX_DIST}pages.html`;
const DIST_PAGES_JS = `${PREFIX_DIST}pages.js`;
const DIST_UI = `${PREFIX_DIST}ui.js`;

// layers
const LAYERS = fs.readdirSync(PATH_APP_LAYERS)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => fs.lstatSync(path.resolve(PATH_APP_LAYERS, name)).isDirectory());

// shadow dom ids/classes
const SELECTORS_LAYERS = LAYERS.reduce((accum, layer) => {
    accum[layer] = {
        shadow_ui: formatDomSelector(`extento-layer-${layer}-shadow-ui`),
    };

    return accum;
}, {});

const SELECTORS_PAGES = {
    options: formatDomSelector('app-page-options-extento-shadow-node'),
    popup: formatDomSelector('app-page-popup-extento-shadow-node'),
    tab: formatDomSelector('app-page-tab-extento-shadow-node'),
};

const SELECTOR_DOM_CLASSNAME = formatDomSelector('extento-shadow-dom');

// channels for events and messages 
const CHANNEL_PUBLISH = 'EXTENTO_CHANNEL_PUBLISH';
const CHANNEL_WORKER_PROXY = 'EXTENTO_CHANNEL_WORKER_PROXY';
const CHANNEL_WORKER_INBOUND = 'EXTENTO_CHANNEL_WORKER_INBOUND';

// selective builds
const PROVIDED_SELECTIVE_BUILD_CONFIG = USER_CONFIG.selective_builds;
const DEFAULT_SELECTIVE_BUILD = 'master';
const SELECTIVE_BUILD = process.env.SELECTIVE_BUILD
    || process.env.EXTENTO_SELECTIVE_BUILD
    || DEFAULT_SELECTIVE_BUILD;

const SELECTIVE_BUILDS_CONFIG = {
    [DEFAULT_SELECTIVE_BUILD]: {
        layers: LAYERS,
    },
    ...PROVIDED_SELECTIVE_BUILD_CONFIG,
};

const SELECTIVE_BUILD_LAYERS = SELECTIVE_BUILDS_CONFIG[SELECTIVE_BUILD].layers;
const SELECTIVE_BUILDS = _.union(
    Object.keys(PROVIDED_SELECTIVE_BUILD_CONFIG),
    [DEFAULT_SELECTIVE_BUILD],
);

// assets
const PATH_APP_ICON_BASE_DIR = path.resolve(PATH_APP, 'icons');
const PATH_APP_ICONS = fs.existsSync(path.resolve(PATH_APP_ICON_BASE_DIR, SELECTIVE_BUILD))
    ? path.resolve(PATH_APP_ICON_BASE_DIR, SELECTIVE_BUILD)
    : path.resolve(PATH_APP_ICON_BASE_DIR, DEFAULT_SELECTIVE_BUILD);

const ICONS = fs.readdirSync(PATH_APP_ICONS)
    .filter((name) => name.startsWith(PREFIX_ICON))
    .filter((name) => fs.lstatSync(path.resolve(PATH_APP_ICONS, name)).isFile())
    .map((name) => ({
        filepath: path.resolve(PATH_APP_ICONS, name),
        name,
        size: name.replace(PREFIX_ICON, '').split('.')[0],
    }));

module.exports = throwOnNonExistence({
    CHANNEL_PUBLISH,
    CHANNEL_WORKER_PROXY,
    CHANNEL_WORKER_INBOUND,
    CLEARABLE_PREFIXES,
    CODE_GEN_LAYER_EXPORTS,
    DEFAULT_SELECTIVE_BUILD,
    DIST_BACKGROUND,
    DIST_CONTENT_SCRIPT,
    DIST_ONLOAD,
    DIST_PAGES_HTML,
    DIST_PAGES_JS,
    DIST_UI,
    ICONS,
    LAYERS,
    PREFIX_DIST,
    PREFIX_ICON,
    SELECTIVE_BUILD_LAYERS,
    SELECTIVE_BUILD,
    SELECTIVE_BUILDS_CONFIG,
    SELECTIVE_BUILDS,
    USER_CONFIG,
    PATH_APP,
    PATH_APP_BUILDS,
    PATH_APP_EXTENSION,
    PATH_APP_ICONS,
    PATH_APP_LAYERS,
    PATH_APP_POSTCSS,
    PATH_APP_SHARED,
    PATH_APP_STYLES,
    PATH_INTERNAL,
    PATH_INTERNAL_BRIDGE,
    PATH_INTERNAL_BRIDGE_ENTRIES_BACKGROUND,
    PATH_INTERNAL_BRIDGE_ENTRIES_CONTENT_SCRIPT,
    PATH_INTERNAL_BRIDGE_ENTRIES_ONLOAD,
    PATH_INTERNAL_BRIDGE_ENTRIES_PAGES_HTML,
    PATH_INTERNAL_BRIDGE_ENTRIES_PAGES,
    PATH_INTERNAL_BRIDGE_ENTRIES_UI,
    PATH_INTERNAL_BRIDGE_ENTRIES,
    PATH_INTERNAL_COMPILED,
    PATH_INTERNAL_COMPILED_PUBLIC,
    PATH_INTERNAL_COMPILED_REFERENTIAL,
    PATH_INTERNAL_CORE,
    PATH_TSCONFIGS_BASE,
    PATH_TSCONFIGS_WEBPACK,
    PATH_WEBPACK_SHARED,
    PATH_WEBPACK_CONFIG_DEV,
    PATH_WEBPACK_CONFIG_PROD,
    PATH_WEBPACK_CUSTOM_PLUGIN,
    PATH_WEBPACK_SHARED_STYLE_RULES,
    OUTPUT_PATH_APP_EXTENSION_MANIFEST,
    OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_CONSTANTS,
    OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_INDEX,
    OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_MANIFEST,
    OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_PAGES,
    SELECTORS_LAYERS,
    SELECTORS_PAGES,
    SELECTOR_DOM_CLASSNAME,
});
