module.exports = [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
        strategy: 'base',
    }),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/aspect-ratio')
];
