const macros = require('~/node/validate/macros');

module.exports = {
    type: 'object',
    required: [
        'PAGES'
    ],
    properties: {
        PAGES: {
            type: 'object',
            properties: {
                options: macros.single_layer,
                popup: macros.single_layer,
                tab: macros.single_layer,
            },
        },
    },
};