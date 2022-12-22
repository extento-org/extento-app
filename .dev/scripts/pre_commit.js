/* -------------------------------------------------------------------------- */
/*                    Only commit template user space code                    */
/* -------------------------------------------------------------------------- */

const fs = require('fs');

const paths = require('./_paths');
const git = require('./_git');

const current_space = fs.readFileSync(paths.SPACES_SOURCE_FILE, 'utf-8').trim();

if (
    (
        git.CHECKED_OUT_BRANCH === 'develop'
        || git.CHECKED_OUT_BRANCH.endsWith('/work')
    ) && current_space !== 'template'
) {
    throw new Error(`Cannot commit non-template user space. See the .dev script for swapping spaces.`);
}
