const { execSync } = require('child_process');

const paths = require('./_paths');
const log = require('./_log');

const DEFAULT_PACKAGES = ['npm', 'npx', 'find', 'trash'];
const DEFAULT_EXEC_STDIO = 'inherit';
const DEFAULT_EXEC_ENCODING = 'utf-8';
const DEFAULT_EXEC_CWD = paths.REPO_APP;
const DEFAULT_RESET_ROOT = paths.REPO_APP;
const DEFAULT_EXEC_OPTS = { 
    stdio: DEFAULT_EXEC_STDIO, 
    encoding: DEFAULT_EXEC_ENCODING, 
    cwd: DEFAULT_EXEC_CWD 
};

const _execAtRoot = (
    cmd, 
    opts = DEFAULT_EXEC_OPTS,
) => {
    const { 
        stdio = DEFAULT_EXEC_STDIO, 
        encoding = DEFAULT_EXEC_ENCODING, 
        cwd = DEFAULT_EXEC_CWD, 
        ...opts 
    } = opts;

    return execSync(
        cmd,
        { cwd, encoding, stdio, ...opts }
    );
};

const _throwPackageCheck = (packages) => {
    const nonexistentPackages = packages.concat(DEFAULT_PACKAGES).map(package => {
        try {
            _execAtRoot(
                `type -P ${package} &>/dev/null`
            );
            return null;
        } catch(err) {
            return package;
        }
    }).filter(e => e);

    if (nonexistentPackages.length) {
        nonexistentPackages.forEach(nonexistentPackage => {
            log.error(`MISSING DEP: install "${nonexistentPackage}" on your system`)
        });
        throw new Error(`missing system dependencies`);
    }
};

const reset = (cmd, opts = {
    exec_opts: DEFAULT_OPTS,
    packages: DEFAULT_PACKAGES,
    root: DEFAULT_RESET_ROOT,
}) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }

    const { exec_opts = DEFAULT_OPTS, packages = DEFAULT_PACKAGES } = opts;

    _throwPackageCheck(packages);
    log.info('deleting all node_modules...');
    _execAtRoot(`find . -name node_modules -type d -prune -exec trash {} +`, {
        cwd: DEFAULT_RESET_ROOT,
    });
    _execAtRoot(cmd, exec_opts);
    log.info('reinstalling npm packages...');
    _execAtRoot(`npm install`, {
        cwd: DEFAULT_RESET_ROOT,
    });
};

const quick = (cmd, opts = {
    exec_opts: DEFAULT_OPTS,
    packages: DEFAULT_PACKAGES
}) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }
    
    const { exec_opts = DEFAULT_OPTS, packages = DEFAULT_PACKAGES } = opts;
    _throwPackageCheck(packages);
    _execAtRoot(cmd, exec_opts);
};

module.exports = {
    quick,
    reset,
};