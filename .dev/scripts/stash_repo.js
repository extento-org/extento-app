/* -------------------------------------------------------------------------- */
/*                     Use before running dangerous stuff                     */
/* -------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');

const log = require('./_log')
const paths = require('./_paths');
const shell = require('./_shell');

shell.reset(
    () => {
        const name = 'repo-' + Date.now();
        const stash_path = path.resolve(paths.STASH_DIR, name);
        fs.mkdirSync(stash_path);
        
        shell.quick(`cp -r ${paths.REPO_APP}/. ${stash_path}`);
        log.success(`stashed repo`);
    }
);

log.success(`reset repo`);