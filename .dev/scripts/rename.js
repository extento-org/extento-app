const path = require('path');
const shell = require('./shell');

// const FROM = process.env.FROM;
// const TO = process.env.TO;

// if (!FROM) {
//     throw new Error('must specify process.env.FROM');
// }

// if (!TO) {
//     throw new Error('must specify process.env.TO');
// }

// shell(`find . -exec rename 's/WORKSPACE/\LAYER/' * {} +`, { packages: ['rename'] });
// shell(`find . -exec rename 's/Workspace/\Layer/' * {} +`, { packages: ['rename'] });
// shell(`find . -exec rename 's/workspace/\layer/' * {} +`, { packages: ['rename'] });