const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

// UPDATE ME to add new script.<lifecycle> scripts
const SUPPORTED_PREFIXES = {
    on_change: (compiler, func) => {
        compiler.hooks.beforeCompile.tapAsync('BeforeCompilePlugin', (...[, callback]) => func(callback));
    },
    initialize: (compiler, func) => {
        compiler.hooks.initialize.tap('Initialize', func);
    },
};

// runs node scripts in series and aggregates results
// will run each script regardless if a previous one errors
const recursiveSequentialScripts = (lastScripts, results = []) => {
    if (lastScripts.length === 0) {
        return;
    }
    const scriptName = lastScripts[0];
    const scriptFunction = require(path.resolve(__dirname, scriptName));

    let result;
    let err;
    try {
        result = scriptFunction();
        log.success(`ran ${scriptName}`);
    } catch (_err) {
        err = _err;
        log.error(`failed ${scriptName} with message: ${_err.message}`, err);
    }

    results.push({ [scriptName]: { result, err } });
    recursiveSequentialScripts(lastScripts.slice(1), results);
};

// produces an array of functions, each of which run scripts associated with a webpack hook
const commands = Object.entries(fs.readdirSync(path.resolve(__dirname))
    .reduce((accum, name) => {
        if (name.endsWith('.js') && name !== 'index.js') {
            const command = name.split('.')[0];
            if (typeof accum[command] === 'undefined') {
                accum[command] = [];
            }
            accum[command].push(name);
        }

        return accum;
    }, {}))
    .reduce((accum, [command, scripts]) => ([
        ...accum,
        (compiler = null, cb = () => null) => {
            if (typeof SUPPORTED_PREFIXES[command] === 'undefined') {
                if (!compiler) {
                    cb(`${command}.* scripts are not supported. add them to the supported script prefixes.`);
                }
                return;
            }
            if (!compiler) {
                recursiveSequentialScripts(scripts);
            } else {
                SUPPORTED_PREFIXES[command](
                    compiler,
                    (callback = () => null) => {
                        recursiveSequentialScripts(scripts);
                        callback();
                    },
                );
            }
        },
    ]), []);

module.exports = {
    apply: (compiler) => {
        commands.forEach((command) => command(compiler));
    },
};
