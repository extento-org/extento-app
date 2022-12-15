const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const throwOnNonExistence = require('./utils/throwOnNonExistence');

const PATH_APP = path.resolve(__dirname, '..', '..');
const PATH_APP_BUILDS = path.resolve(PATH_APP, 'builds');
const PATH_APP_EXTENSION = path.resolve(PATH_APP, 'chrome-v3');
const PATH_APP_STYLES = path.resolve(PATH_APP, 'styles');
const PATH_APP_WEBPACK = path.resolve(PATH_APP, '.extento.webpack.js');
const PATH_APP_LAYERS = path.resolve(PATH_APP, 'layers');
const PATH_BASE_TSCONFIG = path.resolve(__dirname, 'tsconfigs', 'base.json');
const PATH_INTERNAL = path.resolve(__dirname, '..');
const PATH_INTERNAL_API = path.resolve(PATH_INTERNAL, 'api');
const PATH_INTERNAL_CODEGEN = path.resolve(PATH_INTERNAL, 'codegen');
const PATH_INTERNAL_CORE = path.resolve(PATH_INTERNAL, 'core');
const PATH_INTERNAL_ENTRIES = path.resolve(PATH_INTERNAL, 'entries');
const PATH_INTERNAL_ENTRIES_BACKGROUND = path.resolve(PATH_INTERNAL_ENTRIES, 'background.ts');
const PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT = path.resolve(PATH_INTERNAL_ENTRIES, 'content_script.ts');
const PATH_INTERNAL_ENTRIES_ONLOAD = path.resolve(PATH_INTERNAL_ENTRIES, 'onload.ts');
const PATH_INTERNAL_ENTRIES_PAGES = path.resolve(PATH_INTERNAL_ENTRIES, 'pages.tsx');
const PATH_INTERNAL_ENTRIES_PAGES_HTML = path.resolve(PATH_INTERNAL_ENTRIES, 'pages.html');
const PATH_INTERNAL_ENTRIES_UI = path.resolve(PATH_INTERNAL_ENTRIES, 'ui.tsx');
const PATH_INTERNAL_TYPES = path.resolve(PATH_INTERNAL, 'types', 'index.ts');
const PATH_MASTER_POSTCSS = path.resolve(PATH_APP, '.extento.postcss.js');
const PATH_WEBPACK_PRODUCTION = path.resolve(__dirname, 'webpack.production.js');
const PATH_WEBPACK_SCRIPTS = path.resolve(__dirname, 'webpack-scripts');
const PATH_WEBPACK_SCRIPT_GEN_MANIFEST = path.resolve(PATH_WEBPACK_SCRIPTS, 'on_change.genManifest.js');
const PATH_WEBPACK_SCRIPT_GEN_STYLESHEETS = path.resolve(PATH_WEBPACK_SCRIPTS, 'on_change.genStylesheets.js');
const PATH_WEBPACK_SCRIPT_GEN_TYPES = path.resolve(PATH_WEBPACK_SCRIPTS, 'on_change.genTypes.js');
const PATH_WEBPACK_SCRIPT_GEN_LAYER_MODULES = path.resolve(PATH_WEBPACK_SCRIPTS, 'on_change.genLayerModules.js');
const PATH_WEBPACK_SCRIPT_PREPARE_ASSETS = path.resolve(PATH_WEBPACK_SCRIPTS, 'on_change.prepareAssets.js');
const PATH_WEBPACK_SCRIPT_SELECTIVE_BUILD_COMPILER_ADJUSTMENTS = path.resolve(PATH_WEBPACK_SCRIPTS, 'initialize.selectiveBuildCompilerAdjustments.js');
const PATH_WEBPACK_TSCONFIG = path.resolve(__dirname, 'tsconfigs', 'webpack.json');

const OPTIONAL_PATH_APP_OPTIONS_PAGE = path.resolve(PATH_APP, 'pages', 'Options.tsx');
const OPTIONAL_PATH_APP_POPUP_PAGE = path.resolve(PATH_APP, 'pages', 'Popup.tsx');
const OPTIONAL_PATH_APP_TAB_PAGE = path.resolve(PATH_APP, 'pages', 'Tab.tsx');
const OUTPUT_PATH_APP_EXTENSION_MANIFEST = path.resolve(PATH_APP_EXTENSION, 'manifest.json');

const PACKAGE_JSON = require('../../package.json');

const { extento: USER_CONFIG } = PACKAGE_JSON;

// a list of files we want to aggregate in codegen
const CODE_GEN_LAYER_EXPORTS = [
    'worker.ts',
    'contentScriptProcess.ts',
    'manifest.json',
    'onload.ts',
    'ui',
    'state.ts',
];

// permissions that each layer needs to have
const BASE_CHROME_PERMISSIONS = ['storage'];

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
const LAYERS = fs
    .readdirSync(PATH_APP_LAYERS)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => fs.lstatSync(path.resolve(PATH_APP_LAYERS, name)).isDirectory());

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

const ICONS = fs
    .readdirSync(PATH_APP_ICONS)
    .filter((name) => name.startsWith(PREFIX_ICON))
    .filter((name) => fs.lstatSync(path.resolve(PATH_APP_ICONS, name)).isFile())
    .map((name) => ({
        filepath: path.resolve(PATH_APP_ICONS, name),
        name,
        size: name.replace(PREFIX_ICON, '').split('.')[0],
    }));

module.exports = throwOnNonExistence({
    BASE_CHROME_PERMISSIONS,
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
    OPTIONAL_PATH_APP_OPTIONS_PAGE,
    OPTIONAL_PATH_APP_POPUP_PAGE,
    OPTIONAL_PATH_APP_TAB_PAGE,
    OUTPUT_PATH_APP_EXTENSION_MANIFEST,
    PATH_APP_BUILDS,
    PATH_APP_EXTENSION,
    PATH_APP_ICONS,
    PATH_APP_STYLES,
    PATH_APP_WEBPACK,
    PATH_APP_LAYERS,
    PATH_APP,
    PATH_BASE_TSCONFIG,
    PATH_INTERNAL_API,
    PATH_INTERNAL_CODEGEN,
    PATH_INTERNAL_CORE,
    PATH_INTERNAL_ENTRIES_BACKGROUND,
    PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT,
    PATH_INTERNAL_ENTRIES_ONLOAD,
    PATH_INTERNAL_ENTRIES_PAGES_HTML,
    PATH_INTERNAL_ENTRIES_PAGES,
    PATH_INTERNAL_ENTRIES_UI,
    PATH_INTERNAL_ENTRIES,
    PATH_INTERNAL_TYPES,
    PATH_INTERNAL,
    PATH_MASTER_POSTCSS,
    PATH_WEBPACK_PRODUCTION,
    PATH_WEBPACK_SCRIPT_GEN_MANIFEST,
    PATH_WEBPACK_SCRIPT_GEN_STYLESHEETS,
    PATH_WEBPACK_SCRIPT_GEN_TYPES,
    PATH_WEBPACK_SCRIPT_GEN_LAYER_MODULES,
    PATH_WEBPACK_SCRIPT_PREPARE_ASSETS,
    PATH_WEBPACK_SCRIPT_SELECTIVE_BUILD_COMPILER_ADJUSTMENTS,
    PATH_WEBPACK_SCRIPTS,
    PATH_WEBPACK_TSCONFIG,
    PREFIX_DIST,
    PREFIX_ICON,
    SELECTIVE_BUILD_LAYERS,
    SELECTIVE_BUILD,
    SELECTIVE_BUILDS_CONFIG,
    SELECTIVE_BUILDS,
    USER_CONFIG,
    LAYERS,
});
