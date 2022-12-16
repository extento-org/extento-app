// This script does the following things: 
// 1) checks that certain paths and folders exist
// 2) ensures consistency between to/from spaces & template space 
// 3) move files/folders around and initializes next user space

const fs = require('fs');
const path = require('path');

const log = require('./_log')
const paths = require('./_paths');
const shell = require('./_shell');

/* ----------------------------- Util Functions ----------------------------- */
const _trimmedFilesMatch = (path_a, path_b) => fs.readFileSync(path_a, 'utf-8').trim()
    === fs.readFileSync(path_b, 'utf-8').trim();

/* ------------------------- Error/Warning Tracking ------------------------- */
const WARNINGS_INTEGRITY = [];
const ERRORS_INTEGRITY = [];
const ERRORS_FS = [];

/* ------------------------------- Space Names ------------------------------ */
const NEXT_SPACE = process.env.SPACE;
const TEMPLATE_SPACE = 'template';

/* -------------------------- File and Folder Names ------------------------- */
const FOLDER_ICONS = 'icons';
const FOLDER_LAYERS = 'layers';
const FOLDER_PAGES = 'pages';
const FOLDER_SHARED = 'shared';
const FOLDER_STYLES = 'styles';
const FILE_ESLINT = 'eslintrc.js';
const FILE_POSTCSS = 'postcss.js';
const FILE_PACKAGE_JSON = 'package.json';
const FILE_TSCONFIG = 'tsconfig.json';

/* ------------------------------- Base Paths ------------------------------- */
const PATH_SOURCE = path.resolve(paths.REPO_APP, '.source');
const PATH_DEV_DIR = path.resolve(paths.REPO_APP, '.dev');
const PATH_DEV_SPACES = path.resolve(PATH_DEV_DIR, 'spaces');
const PATH_NEXT_SPACE = path.resolve(PATH_DEV_SPACES, NEXT_SPACE);
const PATH_TEMPLATE_SPACE = path.resolve(PATH_DEV_SPACES, TEMPLATE_SPACE);

/* ---------------------------- User Space Paths ---------------------------- */
const PATH_ROOT_PACKAGE_JSON = path.resolve(paths.REPO_APP, FILE_PACKAGE_JSON);
const PATH_ROOT_POSTCSS = path.resolve(paths.REPO_APP, FILE_POSTCSS);
const PATH_ROOT_ESLINT = path.resolve(paths.REPO_APP, FILE_ESLINT);
const PATH_ROOT_ICONS = path.resolve(paths.REPO_APP, FOLDER_ICONS);
const PATH_ROOT_LAYERS = path.resolve(paths.REPO_APP, FOLDER_LAYERS);
const PATH_ROOT_PAGES = path.resolve(paths.REPO_APP, FOLDER_PAGES);
const PATH_ROOT_SHARED = path.resolve(paths.REPO_APP, FOLDER_SHARED);
const PATH_ROOT_STYLES = path.resolve(paths.REPO_APP, FOLDER_STYLES);

const PATH_NEXT_PACKAGE_JSON = path.resolve(PATH_NEXT_SPACE, FILE_PACKAGE_JSON);
const PATH_NEXT_POSTCSS = path.resolve(PATH_NEXT_SPACE, FILE_POSTCSS);
const PATH_NEXT_ESLINT = path.resolve(PATH_NEXT_SPACE, FILE_ESLINT);
const PATH_NEXT_ICONS = path.resolve(PATH_NEXT_SPACE, FOLDER_ICONS);
const PATH_NEXT_LAYERS = path.resolve(PATH_NEXT_SPACE, FOLDER_LAYERS);
const PATH_NEXT_LAYERS_ESLINT = path.resolve(PATH_NEXT_SPACE, FOLDER_LAYERS, FILE_ESLINT);
const PATH_NEXT_LAYERS_TSCONFIG = path.resolve(PATH_NEXT_SPACE, FOLDER_LAYERS, FILE_TSCONFIG);
const PATH_NEXT_PAGES = path.resolve(PATH_NEXT_SPACE, FOLDER_PAGES);
const PATH_NEXT_SHARED = path.resolve(PATH_NEXT_SPACE, FOLDER_SHARED);
const PATH_NEXT_STYLES = path.resolve(PATH_NEXT_SPACE, FOLDER_STYLES);

const PATH_TEMPLATE_PACKAGE_JSON = path.resolve(PATH_TEMPLATE_SPACE, FILE_PACKAGE_JSON);
const PATH_TEMPLATE_POSTCSS = path.resolve(PATH_TEMPLATE_SPACE, FILE_POSTCSS);
const PATH_TEMPLATE_ESLINT = path.resolve(PATH_TEMPLATE_SPACE, FILE_ESLINT);
const PATH_TEMPLATE_ICONS = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_ICONS);
const PATH_TEMPLATE_LAYERS = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_LAYERS);
const PATH_TEMPLATE_LAYERS_ESLINT = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_LAYERS, FILE_ESLINT);
const PATH_TEMPLATE_LAYERS_TSCONFIG = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_LAYERS, FILE_TSCONFIG);
const PATH_TEMPLATE_PAGES = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_PAGES);
const PATH_TEMPLATE_SHARED = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_SHARED);
const PATH_TEMPLATE_STYLES = path.resolve(PATH_TEMPLATE_SPACE, FOLDER_STYLES);

/* ------------------------- Check Folder Existence ------------------------- */
if (!fs.existsSync(PATH_DEV_DIR)) {
    ERRORS_FS.push(`${PATH_DEV_DIR} doesn't exist`);
}
if (!fs.existsSync(PATH_DEV_SPACES)) {
    ERRORS_FS.push(`${PATH_DEV_SPACES} doesn't exist`);
}
if (!fs.existsSync(PATH_SOURCE)) {
    ERRORS_FS.push(`${PATH_SOURCE} doesn't exist`);
}

// check that the .source file represents a valid space
// TODO: we'll need a clean way to handle failure case at some point
const SOURCE_SPACE = fs.readFileSync(PATH_SOURCE, 'utf-8').trim();
const PATH_SOURCE_SPACE = path.resolve(PATH_DEV_SPACES, SOURCE_SPACE);

if (NEXT_SPACE === SOURCE_SPACE) {
    ERRORS_FS.push(`cannot swap with ${SOURCE_SPACE} found in .source file`)
}
if (!fs.existsSync(PATH_SOURCE_SPACE)) {
    ERRORS_FS.push(`${PATH_SOURCE_SPACE} doesn't exist`);
}

// next space values
const DIRS_NEXT_SPACE_LAYERS = fs.readdirSync(PATH_NEXT_LAYERS)
    .map((_name) => path.resolve(PATH_NEXT_LAYERS, _name))
    .filter((_path) => fs.statSync(_path).isDirectory());

/* -------------------------- Integrity Check Logic ------------------------- */
if (!_trimmedFilesMatch(PATH_TEMPLATE_ESLINT, PATH_NEXT_ESLINT)) {
    WARNINGS_INTEGRITY.push(`${FILE_ESLINT} files do not match`);
}
if (!_trimmedFilesMatch(PATH_TEMPLATE_POSTCSS, PATH_NEXT_POSTCSS)) {
    WARNINGS_INTEGRITY.push(`${FILE_POSTCSS} files do not match`);
}
if (!_trimmedFilesMatch(PATH_NEXT_LAYERS_ESLINT, PATH_TEMPLATE_LAYERS_ESLINT)) {
    WARNINGS_INTEGRITY.push(`${FILE_ESLINT} files withing respective layers/* do not match`);
}
if (!_trimmedFilesMatch(PATH_NEXT_LAYERS_TSCONFIG, PATH_TEMPLATE_LAYERS_TSCONFIG)) {
    WARNINGS_INTEGRITY.push(`${FILE_TSCONFIG} files withing respective layers/* do not match`);
}

console.log(JSON.stringify({
    WARNINGS_INTEGRITY,
    ERRORS_INTEGRITY,
    ERRORS_FS,
    NEXT_SPACE,
    TEMPLATE_SPACE,
    FOLDER_ICONS,
    FOLDER_LAYERS,
    FOLDER_PAGES,
    FOLDER_SHARED,
    FOLDER_STYLES,
    FILE_ESLINT,
    FILE_POSTCSS,
    FILE_PACKAGE_JSON,
    FILE_TSCONFIG,
    PATH_SOURCE,
    PATH_DEV_DIR,
    PATH_DEV_SPACES,
    PATH_NEXT_SPACE,
    PATH_TEMPLATE_SPACE,
    PATH_ROOT_PACKAGE_JSON,
    PATH_ROOT_POSTCSS,
    PATH_ROOT_ESLINT,
    PATH_ROOT_ICONS,
    PATH_ROOT_LAYERS,
    PATH_ROOT_PAGES,
    PATH_ROOT_SHARED,
    PATH_ROOT_STYLES,
    PATH_NEXT_PACKAGE_JSON,
    PATH_NEXT_POSTCSS,
    PATH_NEXT_ESLINT,
    PATH_NEXT_ICONS,
    PATH_NEXT_LAYERS,
    PATH_NEXT_LAYERS_ESLINT,
    PATH_NEXT_LAYERS_TSCONFIG,
    PATH_NEXT_PAGES,
    PATH_NEXT_SHARED,
    PATH_NEXT_STYLES,
    PATH_TEMPLATE_PACKAGE_JSON,
    PATH_TEMPLATE_POSTCSS,
    PATH_TEMPLATE_ESLINT,
    PATH_TEMPLATE_ICONS,
    PATH_TEMPLATE_LAYERS,
    PATH_TEMPLATE_LAYERS_ESLINT,
    PATH_TEMPLATE_LAYERS_TSCONFIG,
    PATH_TEMPLATE_PAGES,
    PATH_TEMPLATE_SHARED,
    PATH_TEMPLATE_STYLES
}, null, 2))

/* ----------------------------- Error Handling ----------------------------- */
if (ERRORS_FS.length) {
    ERRORS_FS.forEach(log.error);
    return;
}
if (ERRORS_INTEGRITY.length) {
    ERRORS_INTEGRITY.forEach(log.error);
    return;
}
if (WARNINGS_INTEGRITY.length) {
    WARNINGS_INTEGRITY.forEach(log.warn);
}

/* ------------------------------- Swap Logic ------------------------------- */
const FILE_SWAP_SETS = [
    [PATH_ROOT_PACKAGE_JSON, PATH_NEXT_PACKAGE_JSON],
    [PATH_ROOT_POSTCSS, PATH_NEXT_POSTCSS],
    [PATH_ROOT_ESLINT, PATH_NEXT_ESLINT],
];

const FOLDER_SWAP_SETS = [
    [PATH_ROOT_ICONS, PATH_NEXT_ICONS],
    [PATH_ROOT_LAYERS, PATH_NEXT_LAYERS],
    [PATH_ROOT_PAGES, PATH_NEXT_PAGES],
    [PATH_ROOT_SHARED, PATH_NEXT_SHARED],
    [PATH_ROOT_STYLES, PATH_NEXT_STYLES],
];

log.success(`something happened!`)