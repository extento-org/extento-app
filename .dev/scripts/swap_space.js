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
const PATH_SOURCE = path.resolve(paths.REPO_APP, '.space');
const PATH_DEV_DIR = path.resolve(paths.REPO_APP, '.dev');
const PATH_ARCHIVE_DIR = path.resolve(PATH_DEV_DIR, '.archive');
const PATH_STASH_DIR = path.resolve(PATH_ARCHIVE_DIR, String(Date.now()));
const PATH_DEV_SPACES = path.resolve(PATH_DEV_DIR, 'spaces');
const PATH_NEXT_SPACE = path.resolve(PATH_DEV_SPACES, NEXT_SPACE);
const PATH_TEMPLATE_SPACE = path.resolve(PATH_DEV_SPACES, TEMPLATE_SPACE);

const SOURCE_SPACE = fs.readFileSync(PATH_SOURCE, 'utf-8').trim();
const PATH_SOURCE_SPACE = path.resolve(PATH_DEV_SPACES, SOURCE_SPACE);

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

const PATH_SOURCE_PACKAGE_JSON = path.resolve(PATH_SOURCE_SPACE, FILE_PACKAGE_JSON);
const PATH_SOURCE_POSTCSS = path.resolve(PATH_SOURCE_SPACE, FILE_POSTCSS);
const PATH_SOURCE_ESLINT = path.resolve(PATH_SOURCE_SPACE, FILE_ESLINT);
const PATH_SOURCE_ICONS = path.resolve(PATH_SOURCE_SPACE, FOLDER_ICONS);
const PATH_SOURCE_LAYERS = path.resolve(PATH_SOURCE_SPACE, FOLDER_LAYERS);
const PATH_SOURCE_LAYERS_ESLINT = path.resolve(PATH_SOURCE_SPACE, FOLDER_LAYERS, FILE_ESLINT);
const PATH_SOURCE_LAYERS_TSCONFIG = path.resolve(PATH_SOURCE_SPACE, FOLDER_LAYERS, FILE_TSCONFIG);
const PATH_SOURCE_PAGES = path.resolve(PATH_SOURCE_SPACE, FOLDER_PAGES);
const PATH_SOURCE_SHARED = path.resolve(PATH_SOURCE_SPACE, FOLDER_SHARED);
const PATH_SOURCE_STYLES = path.resolve(PATH_SOURCE_SPACE, FOLDER_STYLES);

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
if (NEXT_SPACE === SOURCE_SPACE) {
    ERRORS_FS.push(`next swap space must not equal current source: ${SOURCE_SPACE}`)
}
if (!fs.existsSync(PATH_SOURCE_SPACE)) {
    ERRORS_FS.push(`${PATH_SOURCE_SPACE} does not exist`);
}

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

// console.log(JSON.stringify({
//     WARNINGS_INTEGRITY,
//     ERRORS_INTEGRITY,
//     ERRORS_FS,
//     NEXT_SPACE,
//     TEMPLATE_SPACE,
//     FOLDER_ICONS,
//     FOLDER_LAYERS,
//     FOLDER_PAGES,
//     FOLDER_SHARED,
//     FOLDER_STYLES,
//     FILE_ESLINT,
//     FILE_POSTCSS,
//     FILE_PACKAGE_JSON,
//     FILE_TSCONFIG,
//     PATH_SOURCE,
//     PATH_DEV_DIR,
//     PATH_DEV_SPACES,
//     PATH_NEXT_SPACE,
//     PATH_TEMPLATE_SPACE,
//     PATH_ROOT_PACKAGE_JSON,
//     PATH_ROOT_POSTCSS,
//     PATH_ROOT_ESLINT,
//     PATH_ROOT_ICONS,
//     PATH_ROOT_LAYERS,
//     PATH_ROOT_PAGES,
//     PATH_ROOT_SHARED,
//     PATH_ROOT_STYLES,
//     PATH_NEXT_PACKAGE_JSON,
//     PATH_NEXT_POSTCSS,
//     PATH_NEXT_ESLINT,
//     PATH_NEXT_ICONS,
//     PATH_NEXT_LAYERS,
//     PATH_NEXT_LAYERS_ESLINT,
//     PATH_NEXT_LAYERS_TSCONFIG,
//     PATH_NEXT_PAGES,
//     PATH_NEXT_SHARED,
//     PATH_NEXT_STYLES,
//     PATH_TEMPLATE_PACKAGE_JSON,
//     PATH_TEMPLATE_POSTCSS,
//     PATH_TEMPLATE_ESLINT,
//     PATH_TEMPLATE_ICONS,
//     PATH_TEMPLATE_LAYERS,
//     PATH_TEMPLATE_LAYERS_ESLINT,
//     PATH_TEMPLATE_LAYERS_TSCONFIG,
//     PATH_TEMPLATE_PAGES,
//     PATH_TEMPLATE_SHARED,
//     PATH_TEMPLATE_STYLES
// }, null, 2))

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
const _swapAndStashDir = (
    name,
    path_source_root_dir,
    path_source_dir,
    path_next_dir,
) => {
    log.info(`swapping dir:${name} w/ space:${NEXT_SPACE}/${name} & replacing/stashing space:${SOURCE_SPACE}/${name}`);
    const path_current_dir = path.resolve(paths.REPO_APP, name);

    if (!fs.existsSync(path_current_dir)) {
        throw new Error(`${path_current_dir} does not exist`);
    }
    if (!fs.existsSync(PATH_STASH_DIR)) {
        shell.dry(`mkdir ${PATH_STASH_DIR}`);
    }

    // move previous source into archive
    shell.dry(`mv ${path_source_dir} ${PATH_STASH_DIR}`);
    // replace previous source with current
    shell.dry(`mv ${path_current_dir} ${path_source_root_dir}`);
    // create and copy next into app repo
    shell.dry(`mkdir ${path_current_dir}`);
    shell.dry(`cp -r ${path_next_dir}/. ${path_current_dir}`);
};

const _swapAndStashFile = (
    name,
    path_source_root,
    path_source_filepath,
    path_next_filepath,
) => {
    log.info(`swapping file:${name} w/ space:${NEXT_SPACE}/${name} & replacing/stashing space:${SOURCE_SPACE}/${name}`);

    const path_current_filepath = path.resolve(paths.REPO_APP, name);
    
    if (!fs.existsSync(path_current_filepath)) {
        throw new Error(`${path_current_filepath} does not exist`);
    }
    if (!fs.existsSync(PATH_STASH_DIR)) {
        shell.dry(`mkdir ${PATH_STASH_DIR}`);
    }

    // move previous source into archive
    shell.dry(`mv ${path_source_filepath} ${PATH_STASH_DIR}`);
    // replace previous source with current
    shell.dry(`mv ${path_current_filepath} ${path_source_root}`);
    // create and copy next into app repo
    shell.dry(`cp ${path_next_filepath} ${paths.REPO_APP}`);
};

_swapAndStashFile(FILE_POSTCSS, PATH_SOURCE_SPACE, PATH_SOURCE_POSTCSS, PATH_NEXT_POSTCSS);
_swapAndStashFile(FILE_ESLINT, PATH_SOURCE_SPACE, PATH_SOURCE_ESLINT, PATH_NEXT_ESLINT);
_swapAndStashDir(FOLDER_ICONS, PATH_SOURCE_SPACE, PATH_SOURCE_ICONS, PATH_NEXT_ICONS);
_swapAndStashDir(FOLDER_LAYERS, PATH_SOURCE_SPACE, PATH_SOURCE_LAYERS, PATH_NEXT_LAYERS);
_swapAndStashDir(FOLDER_PAGES, PATH_SOURCE_SPACE, PATH_SOURCE_PAGES, PATH_NEXT_PAGES);
_swapAndStashDir(FOLDER_SHARED, PATH_SOURCE_SPACE, PATH_SOURCE_SHARED, PATH_NEXT_SHARED);
_swapAndStashDir(FOLDER_STYLES, PATH_SOURCE_SPACE, PATH_SOURCE_STYLES, PATH_NEXT_STYLES);

// next up handle package.json
// save next source at .space

log.success(`something happened!`)