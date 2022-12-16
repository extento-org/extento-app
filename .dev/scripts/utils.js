const { execSync } = require('child_process');

const paths = require('./paths');
const { log } = require('./logging');

const execAtRoot = (cmd, opts = { stdio: 'inherit' }, cwd = paths.REPO_APP) => execSync(
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

const runRepoTask = (requiredPackages = [], cmd, cwd = paths.REPO_APP) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }

    requiredPackages.concat(['trash']).forEach(requiredPackage => {
        if (!commandExists(requiredPackage)) {
            throw new Error(`cli dep missing: brew install ${requiredPackage}`);
        }
    });

    log.info('deleting all node_modules...');

    execAtRoot(`find . -name node_modules -type d -prune -exec trash {} +`, undefined, cwd);

    execAtRoot(cmd, undefined, cwd)

    log.info('reinstallings packages...');

    execAtRoot(`npm install`, undefined, cwd);
};

const runRepoShell = (requiredPackages = [], cmd, cwd = paths.REPO_APP) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }

    requiredPackages.concat(['trash']).forEach(requiredPackage => {
        if (!commandExists(requiredPackage)) {
            throw new Error(`cli dep missing: brew install ${requiredPackage}`);
        }
    });

    execAtRoot(cmd, undefined, cwd);
};

module.exports = {
    runRepoTask,
    runRepoShell,
    execAtRoot,
    commandExists,
};