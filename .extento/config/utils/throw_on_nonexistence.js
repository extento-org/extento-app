// ONLY USED FOR DEV PURPOSES
const fs = require('fs');
const _ = require('lodash');
const os = require('os');

module.exports = (file_paths_map) => {
    const must_start_with = os.homedir();

    let invalid_paths = {};

    Object.entries(file_paths_map)
        .forEach(([name, _path]) => {
            if (
                name.startsWith('PATH_') && 
                typeof _path === 'string' && 
                _path.startsWith(must_start_with) && 
                !fs.existsSync(_path)
            ) {
                invalid_paths[name] = _path;
            }
        });

    if (!_.isEmpty(invalid_paths)) {
        console.error(JSON.stringify({ invalid_paths }, null, 2));
        throw new Error(`some of the paths specified in the constants file do not exist`);
    }
    
    return file_paths_map;
};
