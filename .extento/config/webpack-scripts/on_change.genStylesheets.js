const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');

const getStylesheets = () => {
    // remove leading slash if exists
    const getPathToCss = (layer) => path.resolve(constants.PATH_APP, `layers/${layer}/styles/index.css`);
    const getPathToScss = (layer) => path.resolve(constants.PATH_APP, `layers/${layer}/styles/index.scss`);

    const printRequire = (_path) => {
        if (fs.existsSync(_path)) {
            return `require('${_path}')`;
        }
        return `''`;
    };

    const exportContents = `// @ts-nocheck\n\n`
        + `${constants.SELECTIVE_BUILD_LAYERS
            .map((layer) => `const ${toVar(layer)} = { scss: ${printRequire(getPathToScss(layer))}, css: ${printRequire(getPathToCss(layer))} };`)
            .join('\n')}`
        + `\n\nexport default {\n`
        + `${constants.SELECTIVE_BUILD_LAYERS.map((layer) => `    ${toVar(layer)},`).join('\n')}\n`
        + `};\n`;

    fs.writeFileSync(path.resolve(constants.PATH_INTERNAL_CODEGEN, 'webpack.styles.ts'), exportContents);

    log.info(`generated stylesheets`);
};

module.exports = getStylesheets;
