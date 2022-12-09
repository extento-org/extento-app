const path = require('path');
const fs = require('fs');

const PATH_TO_TYPES = path.resolve(__dirname, '../types/index.ts');

if (!fs.existsSync(PATH_TO_TYPES)) throw new Error(`${PATH_TO_TYPES} does not exist.`);

process.env.SELECTIVE_BUILD = 'QA';
require('./scripts/on_change.gen_types');
console.log(fs.readFileSync(PATH_TO_TYPES, 'utf-8'));

process.env.SELECTIVE_BUILD = 'BOSS';

Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })

require('./scripts/on_change.gen_types');
console.log(fs.readFileSync(PATH_TO_TYPES, 'utf-8'));