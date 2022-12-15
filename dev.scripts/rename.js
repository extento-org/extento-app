const path = require('path');
const { runRepoTask, sLog, PATH_NPM, PATH_APP } = require('./utils');

// const FROM = process.env.FROM;
// const TO = process.env.TO;

// if (!FROM) {
//     throw new Error('must specify process.env.FROM');
// }

// if (!TO) {
//     throw new Error('must specify process.env.TO');
// }

// runRepoTask(['rename'], `find . -exec rename 's/WORKSPACE/\LAYER/' * {} +`);
// runRepoTask(['rename'], `find . -exec rename 's/Workspace/\Layer/' * {} +`);
// runRepoTask(['rename'], `find . -exec rename 's/workspace/\layer/' * {} +`);

sLog(`successfully renamed files`);