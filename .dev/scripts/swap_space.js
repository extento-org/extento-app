/* -------------------------------------------------------------------------- */
/*                         Swaps out "user space" code                        */
/* -------------------------------------------------------------------------- */

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
const FILE_POSTCSS = 'postcss.js';
const FILE_PACKAGE_JSON = 'package.json';
const FILE_TSCONFIG = 'tsconfig.json';

/* ------------------------------- Base Paths ------------------------------- */
const PATH_DEV_SPACES = path.resolve(paths.DEV_DIR, 'spaces');
const PATH_NEXT_SPACE = path.resolve(PATH_DEV_SPACES, NEXT_SPACE);
const PATH_TEMPLATE_SPACE = path.resolve(PATH_DEV_SPACES, TEMPLATE_SPACE);
const SOURCE_SPACE = fs.readFileSync(paths.SPACES_SOURCE_FILE, 'utf-8').trim();
const PATH_SOURCE_SPACE = path.resolve(PATH_DEV_SPACES, SOURCE_SPACE);
const PATH_STASH_DIR = path.resolve(paths.ARCHIVE_DIR, `${String(Date.now())}.${SOURCE_SPACE}`);

/* ---------------------------- User Space Paths ---------------------------- */
const PATH_ROOT_PACKAGE_JSON = path.resolve(paths.REPO_APP, FILE_PACKAGE_JSON);
const PATH_NEXT_PACKAGE_JSON = path.resolve(PATH_NEXT_SPACE, FILE_PACKAGE_JSON);
const PATH_NEXT_POSTCSS = path.resolve(PATH_NEXT_SPACE, FILE_POSTCSS);
const PATH_NEXT_TSCONFIG = path.resolve(PATH_NEXT_SPACE, FILE_TSCONFIG);
const PATH_NEXT_ICONS = path.resolve(PATH_NEXT_SPACE, FOLDER_ICONS);
const PATH_NEXT_LAYERS = path.resolve(PATH_NEXT_SPACE, FOLDER_LAYERS);
const PATH_NEXT_PAGES = path.resolve(PATH_NEXT_SPACE, FOLDER_PAGES);
const PATH_NEXT_SHARED = path.resolve(PATH_NEXT_SPACE, FOLDER_SHARED);
const PATH_NEXT_STYLES = path.resolve(PATH_NEXT_SPACE, FOLDER_STYLES);
const PATH_SOURCE_PACKAGE_JSON = path.resolve(PATH_SOURCE_SPACE, FILE_PACKAGE_JSON);
const PATH_SOURCE_POSTCSS = path.resolve(PATH_SOURCE_SPACE, FILE_POSTCSS);
const PATH_SOURCE_TSCONFIG = path.resolve(PATH_SOURCE_SPACE, FILE_TSCONFIG);
const PATH_SOURCE_ICONS = path.resolve(PATH_SOURCE_SPACE, FOLDER_ICONS);
const PATH_SOURCE_LAYERS = path.resolve(PATH_SOURCE_SPACE, FOLDER_LAYERS);
const PATH_SOURCE_PAGES = path.resolve(PATH_SOURCE_SPACE, FOLDER_PAGES);
const PATH_SOURCE_SHARED = path.resolve(PATH_SOURCE_SPACE, FOLDER_SHARED);
const PATH_SOURCE_STYLES = path.resolve(PATH_SOURCE_SPACE, FOLDER_STYLES);
const PATH_TEMPLATE_POSTCSS = path.resolve(PATH_TEMPLATE_SPACE, FILE_POSTCSS);
const PATH_TEMPLATE_TSCONFIG = path.resolve(PATH_TEMPLATE_SPACE, FILE_TSCONFIG);

/* ------------------------- Check Folder Existence ------------------------- */

if (!fs.existsSync(PATH_DEV_SPACES)) {
    ERRORS_FS.push(`${PATH_DEV_SPACES} doesn't exist`);
}
if (NEXT_SPACE === SOURCE_SPACE) {
    ERRORS_FS.push(`next swap space must not equal current source: ${SOURCE_SPACE}`)
}
if (!fs.existsSync(PATH_SOURCE_SPACE)) {
    ERRORS_FS.push(`${PATH_SOURCE_SPACE} does not exist`);
}

/* -------------------------- Integrity Check Logic ------------------------- */
if (!_trimmedFilesMatch(PATH_TEMPLATE_POSTCSS, PATH_NEXT_POSTCSS)) {
    WARNINGS_INTEGRITY.push(`${FILE_POSTCSS} files do not match`);
}

/* ----------------------------- Error Handling ----------------------------- */
if (ERRORS_FS.length) {
    ERRORS_FS.forEach(msg => log.error(msg));
    return;
}
if (ERRORS_INTEGRITY.length) {
    ERRORS_INTEGRITY.forEach(msg => log.error(msg));
    return;
}
if (WARNINGS_INTEGRITY.length) {
    WARNINGS_INTEGRITY.forEach(msg => log.warn(msg));
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
        shell.quick(`mkdir ${PATH_STASH_DIR}`);
    }

    // move previous source into archive
    shell.quick(`mv ${path_source_dir} ${PATH_STASH_DIR}`);
    // replace previous source with current
    shell.quick(`mv ${path_current_dir} ${path_source_root_dir}`);
    // create and copy next into app repo
    shell.quick(`mkdir ${path_current_dir}`);
    shell.quick(`cp -r ${path_next_dir}/. ${path_current_dir}`);
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
        shell.quick(`mkdir ${PATH_STASH_DIR}`);
    }

    // move previous source into archive
    shell.quick(`mv ${path_source_filepath} ${PATH_STASH_DIR}`);
    // replace previous source with current
    shell.quick(`mv ${path_current_filepath} ${path_source_root}`);
    // create and copy next into app repo
    shell.quick(`cp ${path_next_filepath} ${paths.REPO_APP}`);
};

_swapAndStashFile(FILE_POSTCSS, PATH_SOURCE_SPACE, PATH_SOURCE_POSTCSS, PATH_NEXT_POSTCSS);
_swapAndStashFile(FILE_TSCONFIG, PATH_SOURCE_SPACE, PATH_SOURCE_TSCONFIG, PATH_NEXT_TSCONFIG);
_swapAndStashDir(FOLDER_ICONS, PATH_SOURCE_SPACE, PATH_SOURCE_ICONS, PATH_NEXT_ICONS);
_swapAndStashDir(FOLDER_LAYERS, PATH_SOURCE_SPACE, PATH_SOURCE_LAYERS, PATH_NEXT_LAYERS);
_swapAndStashDir(FOLDER_PAGES, PATH_SOURCE_SPACE, PATH_SOURCE_PAGES, PATH_NEXT_PAGES);
_swapAndStashDir(FOLDER_SHARED, PATH_SOURCE_SPACE, PATH_SOURCE_SHARED, PATH_NEXT_SHARED);
_swapAndStashDir(FOLDER_STYLES, PATH_SOURCE_SPACE, PATH_SOURCE_STYLES, PATH_NEXT_STYLES);

log.info(`updating package.json and saving changes to ${PATH_SOURCE_PACKAGE_JSON}`);
const NEXT_PACKAGE_JSON = require(PATH_NEXT_PACKAGE_JSON);
const ROOT_PACKAGE_JSON = require(PATH_ROOT_PACKAGE_JSON);
fs.writeFileSync(PATH_SOURCE_PACKAGE_JSON, JSON.stringify(ROOT_PACKAGE_JSON, null, 4));
fs.writeFileSync(PATH_ROOT_PACKAGE_JSON, JSON.stringify({ ...ROOT_PACKAGE_JSON, ...NEXT_PACKAGE_JSON }, null, 4));

log.info(`updating ${paths.SPACES_SOURCE_FILE} to: ${NEXT_SPACE}`);
fs.unlinkSync(paths.SPACES_SOURCE_FILE);
fs.writeFileSync(paths.SPACES_SOURCE_FILE, NEXT_SPACE);

shell.reset();

log.success(`you are now working with space:${NEXT_SPACE}!!!`)