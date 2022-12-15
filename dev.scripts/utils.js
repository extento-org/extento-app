const path = require('path');
const { execSync } = require('child_process');

const PATH_APP = path.resolve(__dirname, '..');
const PATH_NPM = path.resolve(__dirname, '..', '..', 'npm');

const cLog = (...args) => console.log('🔵 INFO', ...args);
const sLog = (...args) => console.log('🟢 DONE', ...args);

const execAtRoot = (cmd, opts = { stdio: 'inherit' }, cwd = PATH_APP) => execSync(
    cmd,
    { cwd, encoding: 'utf-8', ...opts }
);

const commandExists = (cmd) => {
    try {
        execAtRoot(
            `type -P ${cmd} &>/dev/null`
        );
        return true;
    } catch(err) {
        return false;
    }
};

const runRepoTask = (requiredPackages = [], cmd, cwd = PATH_APP) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }

    requiredPackages.concat(['trash']).forEach(requiredPackage => {
        if (!commandExists(requiredPackage)) {
            throw new Error(`cli dep missing: brew install ${requiredPackage}`);
        }
    });

    cLog('deleting all node_modules...');

    execAtRoot(`find . -name node_modules -type d -prune -exec trash {} +`, undefined, cwd);

    execAtRoot(cmd, undefined, cwd)

    cLog('reinstallings packages...');

    execAtRoot(`npm install`, undefined, cwd);
};

module.exports = {
    PATH_NPM,
    PATH_APP,
    runRepoTask,
    cLog,
    sLog,
    execAtRoot,
    commandExists,
};