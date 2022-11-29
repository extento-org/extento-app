const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

// UPDATE ME to add new script.<lifecycle> scripts
const supported_script_prefixes = {
    on_change: (compiler, func) => {
        compiler.hooks.beforeCompile.tapAsync('BeforeCompilePlugin', (...[,callback]) => func(callback))
    },
    initialize: (compiler, func) => {
        compiler.hooks.initialize.tap('Initialize', func)
    }
};

function wrappedExec(cmd) {
    try {
        return {
            stdout: execSync(cmd).toString()
        };
    } 
    catch (error) {
        return {
            stderr: error.stderr
        };
    }
};

// runs node scripts in series and aggregates results
// will run each script regardless if a previous one errors
const recursive_sequential_scripts = (last_scripts, cb, results = []) => {
    if (last_scripts.length === 0) {
        return cb();
    }
    const script_name = last_scripts[0];
    const { stderr, stdout } = wrappedExec(`node ${path.resolve(__dirname, script_name)}`)
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    const script_results = { stdout, stderr };
    results.push({ [script_name]: script_results });
    recursive_sequential_scripts(last_scripts.slice(1), cb, results);
};

// produces an array of functions, each of which run scripts associated with a webpack hook
const commands = Object.entries(
    fs.readdirSync(path.resolve(__dirname))
        .reduce((accum, name) => {
            if (name.endsWith('.js') && name !== 'index.js') {
                const command = name.split('.')[0];
                if (typeof accum[command] === 'undefined') {
                    accum[command] = [];
                }
                accum[command].push(name);
            }
            return accum;
        }, {})
)
    .reduce((accum, [command, scripts]) => ([
        ...accum,
        (compiler = null, cb = () => null) => {
            if (typeof supported_script_prefixes[command] === 'undefined') {
                if (!compiler) {
                    cb(`${command}.* scripts are not supported. add them to the supported script prefixes.`);
                }
                return;
            }
            if (!compiler) {
                recursive_sequential_scripts(scripts, () => cb());
            } else {
                supported_script_prefixes[command](
                    compiler, 
                    (callback = () => null) => recursive_sequential_scripts(scripts, callback)
                );
            }
        }
    ]), []);

module.exports = {
    apply: (compiler) => {
        commands.forEach(command => command(compiler));
    }
};