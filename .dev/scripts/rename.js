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

// shell.reset(() => shell.quick(`find . -exec rename 's/WORKSPACE/\LAYER/' * {} +`, { packages: ['rename'] }));