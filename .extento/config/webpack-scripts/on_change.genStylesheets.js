const fs = require('fs');
const path = require('path');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');

const getStylesheets = () => {
    // remove leading slash if exists
    const getPathToCss = (workspace) => path.resolve(constants.PATH_APP, `workspaces/${workspace}/styles/index.css`);
    const getPathToScss = (workspace) => path.resolve(constants.PATH_APP, `workspaces/${workspace}/styles/index.scss`);

    const printRequire = (_path) => {
        if (fs.existsSync(_path)) {
            return `require('${_path}')`;
        }
        return `''`;
    };

    const exportContents = `// @ts-nocheck\n\n`
        + `${constants.SELECTIVE_BUILD_WORKSPACES
            .map((workspace) => `const ${toVar(workspace)} = { scss: ${printRequire(getPathToScss(workspace))}, css: ${printRequire(getPathToCss(workspace))} };`)
            .join('\n')}`
        + `\n\nexport default {\n`
        + `${constants.SELECTIVE_BUILD_WORKSPACES.map((workspace) => `    ${toVar(workspace)},`).join('\n')}\n`
        + `};\n`;

    fs.writeFileSync(path.resolve(constants.PATH_INTERNAL_CODEGEN, 'webpack.styles.ts'), exportContents);

    vLog(`generated stylesheets`);
};

module.exports = getStylesheets;
