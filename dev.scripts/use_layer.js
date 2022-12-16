const fs = require('fs');
const path = require('path');
const { runRepoShell, sLog, PATH_APP } = require('./utils');

const TARGET_LAYER = process.env.LAYER;
const TARGET_LAYER_DIR = path.resolve(PATH_APP, `layers.${TARGET_LAYER}`);
const ACTIVE_LAYER_DIR = path.resolve(PATH_APP, `layers`);
const ACTIVE_LAYER_TSCONFIG = path.resolve(PATH_APP, `layers`, 'tsconfig.json');
const ACTIVE_LAYER_ESLINT = path.resolve(PATH_APP, `layers`, 'eslintrc.js');
const TEMPLATE_ROOT_DIR = path.resolve(PATH_APP, 'dev.layers', 'root');
const TEMPLATE_TSCONFIG = path.resolve(TEMPLATE_ROOT_DIR, 'off.tsconfig.json');
const TEMPLATE_ESLINT = path.resolve(TEMPLATE_ROOT_DIR, 'off.eslintrc.js');
const SOURCE_PATH = path.resolve(ACTIVE_LAYER_DIR, '.source');

if (
    fs.readFileSync(ACTIVE_LAYER_ESLINT, 'utf-8').trim()
        !== fs.readFileSync(TEMPLATE_ESLINT, 'utf-8').trim()
) {
    throw new Error(`template eslintrc.js must match that of active layers dir`);
}

if (
    fs.readFileSync(ACTIVE_LAYER_TSCONFIG, 'utf-8').trim()
        !== fs.readFileSync(TEMPLATE_TSCONFIG, 'utf-8').trim()
) {
    throw new Error(`template tsconfig.json must match that of active layers dir`);
}

if (!fs.existsSync(ACTIVE_LAYER_DIR)) {
    throw new Error(`there's no active layers dir`);
}

if (!fs.existsSync(TARGET_LAYER_DIR)) {
    throw new Error(`layers.${TARGET_LAYER} does not exist`);
}

if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error(`${SOURCE_PATH} does not exist`);
}

const SOURCE = fs.readFileSync(SOURCE_PATH, 'utf-8').trim();
const SOURCE_LAYER_DIR = path.resolve(PATH_APP, `layers.${SOURCE}`);

if (TARGET_LAYER === SOURCE) {
    throw new Error('you are trying to swap with the same source layers')
}

if (!fs.existsSync(SOURCE_LAYER_DIR)) {
    throw new Error(`.source file points to layers.${SOURCE} which does not exist`);
}

console.log({
    TARGET_LAYER,
    TARGET_LAYER_DIR,
    ACTIVE_LAYER_DIR,
    SOURCE_PATH,
    SOURCE,
    SOURCE_LAYER_DIR
});

const timestamp = String(Date.now());

const TEMP_DIR = path.resolve(PATH_APP, timestamp);
const ARCHIVE_TEMP_DIR = path.resolve(PATH_APP, '.archive', `layers.${SOURCE}.${timestamp}`);

runRepoShell([], `mv ${SOURCE_LAYER_DIR} ${TEMP_DIR}`);  
runRepoShell([], `mv ${ACTIVE_LAYER_DIR} ${SOURCE_LAYER_DIR}`);
runRepoShell([], `mv ${TEMP_DIR} ${ARCHIVE_TEMP_DIR}`);  
runRepoShell([], `mv ${TEMP_DIR} ${ARCHIVE_TEMP_DIR}`);  

fs.mkdirSync(ACTIVE_LAYER_DIR);

runRepoShell([], `cp -r ${TARGET_LAYER_DIR}/. ${ACTIVE_LAYER_DIR}`);  