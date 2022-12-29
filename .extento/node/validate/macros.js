const constants = require('~/node/constants');

module.exports = {
    all_layers: {
        type: 'array',
        uniqueItems: true,
        maxItems: constants.LAYERS.length,
        minItems: constants.LAYERS.length,
        items: {
            layer: true,
        },
    },
    some_layers: {
        type: 'array',
        uniqueItems: true,
        maxItems: constants.LAYERS.length,
        items: {
            layer: true,
        },
    },
    single_layer: {
        layer: true
    },
};
