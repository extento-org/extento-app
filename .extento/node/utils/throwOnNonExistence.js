const fs = require('fs');
const _ = require('lodash');
const os = require('os');
const log = require('~/node/log');

const PATH_PREFIX = 'PATH_';

module.exports = (filePathsMap) => {
    const mustStartWith = os.homedir();

    const invalidPaths = {};

    Object.entries(filePathsMap)
        .forEach(([name, _path]) => {
            if (
                name.startsWith(PATH_PREFIX)
                && typeof _path === 'string'
                && _path.startsWith(mustStartWith)
                && !fs.existsSync(_path)
            ) {
                invalidPaths[name] = _path;
            }
        });

    if (!_.isEmpty(invalidPaths)) {
        log.error(JSON.stringify({ invalidPaths }, null, 4));
        throw new Error('some of the paths specified in the constants file do not exist');
    }

    return filePathsMap;
};
