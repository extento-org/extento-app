const macros = require('~/node/validate/macros');

module.exports = {
    type: 'object',
    required: [
        'LAYERS',
    ],
    properties: {
        LAYERS: macros.some_layers,
    },
};
