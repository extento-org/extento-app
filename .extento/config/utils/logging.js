/* eslint no-console: ["error", { allow: ["log", "error"] }] */
const _ = require('lodash');

exports.cLog = (prefix = '', ...args) => console.log(prefix.padEnd(9), '|', ...args);
exports.aLog = (...args) => exports.cLog('', ...args);
exports.sLog = (...args) => exports.cLog('🟢 DONE', ...args);
exports.eLog = (...args) => console.error('🔴 ERROR'.padEnd(9), '|', ...args);
exports.iLog = (...args) => exports.cLog('🔵 INFO', ...args);
exports.wLog = (...args) => exports.cLog('🟠 WARN', ...args);
exports.vLog = String(process.env.VERBOSE) === 'true'
    ? exports.iLog : _.noop;
