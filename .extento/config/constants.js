const path = require('path');
const fs = require('fs');
const throw_on_nonexistence = require('./utils/throw_on_nonexistence');

const PATH_APP = path.resolve(__dirname, '..', '..');
const PATH_APP_CONFIG = path.resolve(PATH_APP, 'extento.config.js');
const PATH_APP_ICONS = path.resolve(PATH_APP, 'icons');
const PATH_APP_STYLES = path.resolve(PATH_APP, 'styles');
const PATH_APP_WORKSPACES = path.resolve(PATH_APP, 'workspaces');
const PATH_APP_EXTENSION = path.resolve(PATH_APP, 'chrome-v3');
const PATH_APP_WEBPACK = path.resolve(PATH_APP, 'extento.webpack.js');
const PATH_APP_MANIFEST = path.resolve(PATH_APP, 'extento.manifest.js');
const PATH_INTERNAL = path.resolve(__dirname, '..');
const PATH_INTERNAL_LIBRARY = path.resolve(PATH_INTERNAL, 'library');
const PATH_INTERNAL_ENTRIES = path.resolve(PATH_INTERNAL, 'entries', 'src');
const PATH_INTERNAL_CODEGEN = path.resolve(PATH_INTERNAL, 'codegen', 'src');
const PATH_INTERNAL_TYPES = path.resolve(PATH_INTERNAL, 'types', 'index.ts');
const PATH_INTERNAL_ENTRIES_BROWSER_HTML = path.resolve(PATH_INTERNAL_ENTRIES, 'browser.html');
const PATH_INTERNAL_ENTRIES_BROWSER = path.resolve(PATH_INTERNAL_ENTRIES, 'browser.tsx');
const PATH_INTERNAL_ENTRIES_UI = path.resolve(PATH_INTERNAL_ENTRIES, 'ui.tsx');
const PATH_INTERNAL_ENTRIES_ONLOAD = path.resolve(PATH_INTERNAL_ENTRIES, 'onload.ts');
const PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT = path.resolve(PATH_INTERNAL_ENTRIES, 'content_script.ts');
const PATH_INTERNAL_ENTRIES_BACKGROUND = path.resolve(PATH_INTERNAL_ENTRIES, 'background.ts');
const PATH_MASTER_TSCONFIG = path.resolve(__dirname, 'tsconfig.json');
const PATH_MASTER_POSTCSS = path.resolve(__dirname, 'postcss.config.js');

const OUTPUT_PATH_APP_EXTENSION_MANIFEST = path.resolve(PATH_APP_EXTENSION, 'manifest.json');

// a list of files we want to aggregate in codegen
const CODE_GEN_WORKSPACE_EXPORTS = [
    'onload.ts',
    'ui',
    'content_script_process.ts',
    'config.ts',
    'background_api.ts',
    'manifest.json',
];

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
const DIST_BROWSER_HTML = PREFIX_DIST + 'browser.html';
const DIST_BROWSER_JS = PREFIX_DIST + 'browser.js';
const DIST_UI = PREFIX_DIST + 'ui.js';

// workspaces
const WORKSPACES = fs
    .readdirSync(PATH_APP_WORKSPACES)
    .filter(name => !name.startsWith('.'))
    .filter(name => fs.lstatSync(path.resolve(PATH_APP_WORKSPACES, name)).isDirectory());

// related to selective builds
const DEFAULT_SELECTIVE_BUILD = 'MASTER';
const USER_SELECTIVE_BUILDS = Object.keys(require(PATH_APP_CONFIG)
    .selective_builds);
if (USER_SELECTIVE_BUILDS.includes(DEFAULT_SELECTIVE_BUILD)) {
    throw new Error(`cannot create a build called: ${DEFAULT_SELECTIVE_BUILD}. it is a reserved build name.`);
}
const SELECTIVE_BUILDS = USER_SELECTIVE_BUILDS.concat([DEFAULT_SELECTIVE_BUILD]);

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
    PATH_APP_WORKSPACES,
    PATH_INTERNAL,
    PATH_INTERNAL_LIBRARY,
    PATH_INTERNAL_ENTRIES,
    PATH_INTERNAL_ENTRIES_BROWSER_HTML,
    PATH_INTERNAL_ENTRIES_BROWSER,
    PATH_INTERNAL_ENTRIES_UI,
    PATH_INTERNAL_ENTRIES_ONLOAD,
    PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT,
    PATH_INTERNAL_ENTRIES_BACKGROUND,
    PATH_MASTER_TSCONFIG,
    PATH_MASTER_POSTCSS,
    PATH_APP_MANIFEST,
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
    DIST_BROWSER_HTML,
    DIST_BROWSER_JS,
    DIST_UI,
    DEFAULT_SELECTIVE_BUILD,
    WORKSPACES,
    SELECTIVE_BUILDS,
    ICONS
});
