const macros = require('~/node/validate/macros');

module.exports = {
    type: 'object',
    required: [
        'LAYERS',
        'INTERFACE_NAME',
    ],
    properties: {
        LAYERS: macros.some_layers,
        INTERFACE_NAME: {
            type: 'string'
        },
    },
};
