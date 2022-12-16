const path = require('path');

module.exports = {
    plugins: [
        [
            'tailwindcss',
            {
                config: path.resolve(__dirname, 'styles', 'tailwind', 'tailwind.config.js')
            }
        ],
        [
            'autoprefixer',
            {}
        ]
    ]
};