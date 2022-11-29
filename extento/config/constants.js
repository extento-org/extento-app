const path = require('path');

const PROJECT_PATH = path.resolve(__dirname, '..', '..');
const APP_PATH = path.resolve(PROJECT_PATH, 'app');
const APP_CONFIG_PATH = path.resolve(APP_PATH, 'extento.config.json');
const CHROME_EXTENSION_PATH = path.resolve(PROJECT_PATH, 'dist');
const ICONS_PATH = path.resolve(APP_PATH, 'icons');
const STYLES_PATH = path.resolve(APP_PATH, 'styles');
const WORKSPACES_PATH = path.resolve(APP_PATH, 'workspaces');
const LIBRARY_PATH = path.resolve(__dirname, '..', 'library');
const ENTRIES_PATH = path.resolve(__dirname, '..', 'entries', 'src');
const WORKSPACES_CODEGEN_PATH = path.resolve(__dirname, '..', 'codegen', 'src');
const BROWSER_INDEX_HTML_PATH = path.resolve(ENTRIES_PATH, 'browser.html');
const BROWSER_ENTRY_PATH = path.resolve(ENTRIES_PATH, 'browser.tsx');
const UI_ENTRY_PATH = path.resolve(ENTRIES_PATH, 'ui.tsx');
const ONLOAD_ENTRY_PATH = path.resolve(ENTRIES_PATH, 'onload.ts');
const CONTENT_SCRIPT_ENTRY_PATH = path.resolve(ENTRIES_PATH, 'content_script.ts');
const BACKGROUND_ENTRY_PATH = path.resolve(ENTRIES_PATH, 'background.ts');
const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');
const PROJECT_MANIFEST_PATH = path.resolve(APP_PATH, 'extento.manifest.js');
const CHROME_EXTENSION_MANIFEST_PATH = path.resolve(CHROME_EXTENSION_PATH, 'manifest.json');
const WORKSPACES_NAMES_PATH = path.resolve(WORKSPACES_CODEGEN_PATH, 'webpack.workspaces.ts');
const POSTCSS_CONFIG = path.resolve(__dirname, 'postcss.config.js');

const SUPPORTED_WORKSPACE_EXPORTS = [
    'onload.ts',
    'ui',
    'content_script_process.ts',
    'config.ts',
    'background_api.ts',
    'manifest.json',
];

const INTERNALLY_REQUIRED_PERMISSIONS = [
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

const DIST_ONLOAD = PREFIX_DIST + 'onload.js';
const DIST_BACKGROUND = PREFIX_DIST + 'background.js';
const DIST_CONTENT_SCRIPT = PREFIX_DIST + 'content_script.js';
const DIST_BROWSER_HTML = PREFIX_DIST + 'browser.html';
const DIST_BROWSER_JS = PREFIX_DIST + 'browser.js';
const DIST_UI = PREFIX_DIST + 'ui.js';

module.exports = {
    PROJECT_PATH,
    APP_PATH,
    APP_CONFIG_PATH,
    CHROME_EXTENSION_PATH,
    ICONS_PATH,
    STYLES_PATH,
    WORKSPACES_PATH,
    LIBRARY_PATH,
    BROWSER_INDEX_HTML_PATH,
    BROWSER_ENTRY_PATH,
    UI_ENTRY_PATH,
    ONLOAD_ENTRY_PATH,
    CONTENT_SCRIPT_ENTRY_PATH,
    BACKGROUND_ENTRY_PATH,
    TSCONFIG_PATH,
    POSTCSS_CONFIG,
    PROJECT_MANIFEST_PATH,
    CHROME_EXTENSION_MANIFEST_PATH,
    WORKSPACES_CODEGEN_PATH,
    WORKSPACES_NAMES_PATH,
    SUPPORTED_WORKSPACE_EXPORTS,
    INTERNALLY_REQUIRED_PERMISSIONS,
    PREFIX_DIST,
    PREFIX_ICON,
    CLEARABLE_PREFIXES,
    DIST_ONLOAD,
    DIST_BACKGROUND,
    DIST_CONTENT_SCRIPT,
    DIST_BROWSER_HTML,
    DIST_BROWSER_JS,
    DIST_UI,
};