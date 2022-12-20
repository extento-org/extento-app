const paths = require('./_paths');
const shell = require('./_shell');

const CHECKED_OUT_BRANCH = shell.quick('git rev-parse --abbrev-ref HEAD', {
    packages: ['git'],
    exec_opts: {
        cwd: paths.REPO_APP,
        encoding: 'utf-8',
        stdio: 'pipe'
    }
}).trim();

module.exports = {
    CHECKED_OUT_BRANCH,
};