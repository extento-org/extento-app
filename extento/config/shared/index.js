const fs = require('fs');
const path = require('path');

const {
    WORKSPACES_PATH,
    ICONS_PATH,
    PREFIX_ICON,
} = require('../constants.js');

const get_workspace_dirs = () => fs
    .readdirSync(WORKSPACES_PATH)
    .filter(name => !name.startsWith('.'))
    .filter(name => 
        fs.lstatSync(path.resolve(WORKSPACES_PATH, name)).isDirectory()
    );

const get_icons = () => fs
    .readdirSync(ICONS_PATH)
    .filter(name => name.startsWith(PREFIX_ICON))
    .filter(name => 
        fs.lstatSync(path.resolve(ICONS_PATH, name)).isFile()
    )
    .map(name => ({
        filepath: path.resolve(ICONS_PATH, name),
        name,
        size: name.replace(PREFIX_ICON, '').split('.')[0]
    }))

module.exports = {
    get_workspace_dirs,
    get_icons,
};