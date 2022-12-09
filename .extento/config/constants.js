const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const throw_on_nonexistence = require('./utils/throw_on_nonexistence');

const PATH_APP = path.resolve(__dirname, '..', '..');
const PATH_APP_CONFIG = path.resolve(PATH_APP, '.extento.config.js');
const PATH_APP_ICONS = path.resolve(PATH_APP, 'icons');
const PATH_APP_STYLES = path.resolve(PATH_APP, 'styles');
const PATH_APP_WORKSPACES = path.resolve(PATH_APP, 'workspaces');
const PATH_APP_EXTENSION = path.resolve(PATH_APP, 'chrome-v3');
const PATH_APP_WEBPACK = path.resolve(PATH_APP, '.extento.webpack.js');
const PATH_INTERNAL = path.resolve(__dirname, '..');
const PATH_INTERNAL_CORE = path.resolve(PATH_INTERNAL, 'core');
const PATH_INTERNAL_API = path.resolve(PATH_INTERNAL, 'api');
const PATH_INTERNAL_ENTRIES = path.resolve(PATH_INTERNAL, 'entries');
const PATH_INTERNAL_CODEGEN = path.resolve(PATH_INTERNAL, 'codegen');
const PATH_INTERNAL_TYPES = path.resolve(PATH_INTERNAL, 'types', 'index.ts');
const PATH_INTERNAL_ENTRIES_PAGES_HTML = path.resolve(PATH_INTERNAL_ENTRIES, 'pages.html');
const PATH_INTERNAL_ENTRIES_PAGES = path.resolve(PATH_INTERNAL_ENTRIES, 'pages.tsx');
const PATH_INTERNAL_ENTRIES_UI = path.resolve(PATH_INTERNAL_ENTRIES, 'ui.tsx');
const PATH_INTERNAL_ENTRIES_ONLOAD = path.resolve(PATH_INTERNAL_ENTRIES, 'onload.ts');
const PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT = path.resolve(PATH_INTERNAL_ENTRIES, 'content_script.ts');
const PATH_INTERNAL_ENTRIES_BACKGROUND = path.resolve(PATH_INTERNAL_ENTRIES, 'background.ts');
const PATH_WEBPACK_TSCONFIG = path.resolve(__dirname, 'tsconfigs', 'webpack.json');
const PATH_BASE_TSCONFIG = path.resolve(__dirname, 'tsconfigs', 'base.json');
const PATH_MASTER_POSTCSS = path.resolve(PATH_APP, '.extento.postcss.js');
const PATH_SCRIPT_GEN_MANIFEST = path.resolve(__dirname, 'webpack-scripts', 'on_change.gen_manifest.js');
const PATH_SCRIPT_SELECTIVE_BUILD_COMPILER_ADJUSTMENTS = path.resolve(__dirname, 'webpack-scripts', 'initialize.selective_build_compiler_adjustments.js');
const PATH_SCRIPT_GEN_STYLESHEETS = path.resolve(__dirname, 'webpack-scripts', 'on_change.gen_stylesheets.js');
const PATH_SCRIPT_GEN_TYPES = path.resolve(__dirname, 'webpack-scripts', 'on_change.gen_types.js');
const PATH_SCRIPT_GEN_WORKSPACE_MODULES = path.resolve(__dirname, 'webpack-scripts', 'on_change.gen_workspace_modules.js');
const PATH_SCRIPT_PREPARE_ASSETS = path.resolve(__dirname, 'webpack-scripts', 'on_change.prepare_assets.js');

const OUTPUT_PATH_APP_EXTENSION_MANIFEST = path.resolve(PATH_APP_EXTENSION, 'manifest.json');
const OPTIONAL_PATH_APP_TAB_PAGE = path.resolve(PATH_APP, 'pages', 'Tab.tsx');
const OPTIONAL_PATH_APP_POPUP_PAGE = path.resolve(PATH_APP, 'pages', 'Popup.tsx');
const OPTIONAL_PATH_APP_OPTIONS_PAGE = path.resolve(PATH_APP, 'pages', 'Options.tsx');

// a list of files we want to aggregate in codegen
const CODE_GEN_WORKSPACE_EXPORTS = [
    'onload.ts',
    'ui',
    'content_script_process.ts',
    'config.ts',
    'background_api.ts',
    'manifest.json',
];

// permissions that each workspace needs to have
const BASE_CHROME_PERMISSIONS = [
    'storage'
];

// never fucking change to dot file. 
// it'll fail to load locally in the chrome extensions!
const PREFIX_DIST = 'EXT_DIST.built.';
const PREFIX_ICON = 'icon';
const CLEARABLE_PREFIXES = [
    PREFIX_DIST,
    PREFIX_ICON,
];

// extension dist files
const DIST_ONLOAD = PREFIX_DIST + 'onload.js';
const DIST_BACKGROUND = PREFIX_DIST + 'background.js';
const DIST_CONTENT_SCRIPT = PREFIX_DIST + 'content_script.js';
const DIST_PAGES_HTML = PREFIX_DIST + 'pages.html';
const DIST_PAGES_JS = PREFIX_DIST + 'pages.js';
const DIST_UI = PREFIX_DIST + 'ui.js';

// workspaces
const WORKSPACES = fs
    .readdirSync(PATH_APP_WORKSPACES)
    .filter(name => !name.startsWith('.'))
    .filter(name => fs.lstatSync(path.resolve(PATH_APP_WORKSPACES, name)).isDirectory());

const PROVIDED_SELECTIVE_BUILD_CONFIG = require(PATH_APP_CONFIG).selective_builds;
const DEFAULT_SELECTIVE_BUILD = 'MASTER';
const SELECTIVE_BUILD = process.env.SELECTIVE_BUILD || process.env.EXTENTO_SELECTIVE_BUILD || DEFAULT_SELECTIVE_BUILD;
const SELECTIVE_BUILDS_CONFIG = {
    MASTER: WORKSPACES,
    ...PROVIDED_SELECTIVE_BUILD_CONFIG
};
const SELECTIVE_BUILD_WORKSPACES = SELECTIVE_BUILDS_CONFIG[SELECTIVE_BUILD];
const SELECTIVE_BUILDS = _.union(Object.keys(PROVIDED_SELECTIVE_BUILD_CONFIG), [DEFAULT_SELECTIVE_BUILD]);

// assets
const ICONS = fs
    .readdirSync(PATH_APP_ICONS)
    .filter(name => name.startsWith(PREFIX_ICON))
    .filter(name => fs.lstatSync(path.resolve(PATH_APP_ICONS, name)).isFile())
    .map(name => ({
    filepath: path.resolve(PATH_APP_ICONS, name),
    name,
    size: name.replace(PREFIX_ICON, '').split('.')[0]
}));

module.exports = throw_on_nonexistence({
    PATH_APP,
    PATH_APP_CONFIG,
    PATH_APP_EXTENSION,
    PATH_APP_WEBPACK,
    PATH_APP_ICONS,
    PATH_APP_STYLES,
    OPTIONAL_PATH_APP_TAB_PAGE,
    OPTIONAL_PATH_APP_POPUP_PAGE,
    OPTIONAL_PATH_APP_OPTIONS_PAGE,
    PATH_APP_WORKSPACES,
    PATH_INTERNAL,
    PATH_INTERNAL_CORE,
    PATH_INTERNAL_API,
    PATH_INTERNAL_ENTRIES,
    PATH_INTERNAL_ENTRIES_PAGES_HTML,
    PATH_INTERNAL_ENTRIES_PAGES,
    PATH_INTERNAL_ENTRIES_UI,
    PATH_INTERNAL_ENTRIES_ONLOAD,
    PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT,
    PATH_INTERNAL_ENTRIES_BACKGROUND,
    PATH_WEBPACK_TSCONFIG,
    PATH_BASE_TSCONFIG,
    PATH_MASTER_POSTCSS,
    PATH_SCRIPT_GEN_MANIFEST,
    PATH_SCRIPT_SELECTIVE_BUILD_COMPILER_ADJUSTMENTS,
    PATH_SCRIPT_GEN_STYLESHEETS,
    PATH_SCRIPT_GEN_TYPES,
    PATH_SCRIPT_GEN_WORKSPACE_MODULES,
    PATH_SCRIPT_PREPARE_ASSETS,
    OUTPUT_PATH_APP_EXTENSION_MANIFEST,
    PATH_INTERNAL_CODEGEN,
    PATH_INTERNAL_TYPES,
    CODE_GEN_WORKSPACE_EXPORTS,
    BASE_CHROME_PERMISSIONS,
    PREFIX_DIST,
    PREFIX_ICON,
    CLEARABLE_PREFIXES,
    DIST_ONLOAD,
    DIST_BACKGROUND,
    DIST_CONTENT_SCRIPT,
    DIST_PAGES_HTML,
    DIST_PAGES_JS,
    DIST_UI,
    DEFAULT_SELECTIVE_BUILD,
    WORKSPACES,
    SELECTIVE_BUILD,
    SELECTIVE_BUILD_WORKSPACES,
    SELECTIVE_BUILDS,
    SELECTIVE_BUILDS_CONFIG,
    ICONS
});
