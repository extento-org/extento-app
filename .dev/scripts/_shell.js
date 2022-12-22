const { execSync } = require('child_process');
const _ = require('lodash');

const paths = require('./_paths');
const log = require('./_log');

const DEFAULT_PACKAGES = ['npm', 'npx', 'find', 'trash'];
const DEFAULT_EXEC_STDIO = 'inherit';
const DEFAULT_EXEC_ENCODING = 'utf-8';
const DEFAULT_EXEC_OPTS = { 
    stdio: DEFAULT_EXEC_STDIO, 
    encoding: DEFAULT_EXEC_ENCODING, 
    cwd: paths.REPO_APP 
};

const _execAtRoot = (
    cmd, 
    opts = DEFAULT_EXEC_OPTS,
) => {
    const { 
        stdio = DEFAULT_EXEC_STDIO, 
        encoding = DEFAULT_EXEC_ENCODING, 
        cwd = paths.REPO_APP, 
        ...remaining_opts 
    } = opts;

    return execSync(
        cmd,
        { cwd, encoding, stdio, ...remaining_opts }
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

const _prune_deps = () => {
    _throwPackageCheck(DEFAULT_PACKAGES);
    log.info('deleting node_modules and stale TS build files...');
    _execAtRoot(`find . -name node_modules -type d -prune -exec trash {} +`, {
        cwd: paths.REPO_APP,
    });
    _execAtRoot(`find . -name tsconfig.dist -type d -prune -exec trash {} +`, {
        cwd: paths.REPO_APP,
    });
};

const reset = (fn = _.noop, opts = {
    exec_opts: DEFAULT_EXEC_OPTS,
    packages: DEFAULT_PACKAGES,
    root: paths.REPO_APP,
}) => {
    const { packages = DEFAULT_PACKAGES, root = paths.REPO_APP } = opts;

    _throwPackageCheck(packages);
    _prune_deps();
    fn(opts);
    log.info('reinstalling npm packages...');
    return _execAtRoot(`npm install`, {
        cwd: root,
    });
};

const quick = (cmd, opts = {
    exec_opts: DEFAULT_EXEC_OPTS,
    packages: DEFAULT_PACKAGES
}) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }
    
    const { exec_opts = DEFAULT_EXEC_OPTS, packages = DEFAULT_PACKAGES } = opts;
    _throwPackageCheck(packages);
    return _execAtRoot(cmd, exec_opts);
};

const dry = (cmd, opts = {
    exec_opts: DEFAULT_EXEC_OPTS,
    packages: DEFAULT_PACKAGES
}) => {
    if (!cmd) {
        throw new Error('you did not supply a command');
    }
    
    const { packages = DEFAULT_PACKAGES } = opts;
    _throwPackageCheck(packages);
    console.log('------------------------------------------------------------------------------------------------------------');
    console.log('------------------------------------------------------------------------------------------------------------');
    log.info(`DRY: ${cmd}`);
    console.log('------------------------------------------------------------------------------------------------------------');
    console.log('------------------------------------------------------------------------------------------------------------');
};

module.exports = {
    quick,
    reset,
    dry,
};