const fs = require('fs');
const path = require('path');

const log = require('./_log');

const REPO_APP = path.resolve(__dirname, '..', '..');
const REPO_NPM = path.resolve(__dirname, '..', '..', '..', 'npm');
const DEV_DIR = path.resolve(REPO_APP, '.dev');
const ARCHIVE_DIR = path.resolve(DEV_DIR, '.archive');
const STASH_DIR = path.resolve(REPO_APP, '..', 'stash');
const SPACES_SOURCE_FILE = path.resolve(DEV_DIR, '.space');

const _exports = {
    REPO_APP,
    DEV_DIR,
    ARCHIVE_DIR,
    SPACES_SOURCE_FILE,
    REPO_NPM,
    STASH_DIR,
};

const ERRORS_FS = Object.entries(_exports)
    .map(([name, _path]) => {
        if (!fs.existsSync(_path)) {
            return `${name}:${_path} doesn't exist`
        }
        return null;
    })
    .filter(e => !!e);

if (ERRORS_FS.length) {
    ERRORS_FS.forEach(msg => log.error(msg));
    throw new Error('halting script due to invalid paths');
}

module.exports = _exports;