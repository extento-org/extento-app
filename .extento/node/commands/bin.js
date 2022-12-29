const commands = require('~/node/commands');

commands[process.env.COMMAND](
    (process.env.ARGS || '')
        .split(',')
        .map(str => str.trim())
        .map(str => {
            try {
                return JSON.parse(str);
            } catch (err) {
                return null;
            }
        })
        .filter(e => !!e)
);