const fs = require('fs');
const path = require('path');

const {
    PATH_INTERNAL_CODEGEN,
    PATH_APP,
    SELECTIVE_BUILD_WORKSPACES,
} = require('../constants.js');

const to_var = str => str.split('-').join('_');

const main = () => {
    // remove leading slash if exists
    const path_to_css = (workspace) => path.resolve(PATH_APP, `workspaces/${workspace}/styles/index.css`);
    const path_to_scss = (workspace) => path.resolve(PATH_APP, `workspaces/${workspace}/styles/index.scss`);

    const build_require = (_path) => fs.existsSync(_path) ? `require('${_path}')` : `''`;

    const export_contents = `// @ts-nocheck\n\n` +
        `${SELECTIVE_BUILD_WORKSPACES
            .map((workspace) => `const ${to_var(workspace)} = { scss: ${build_require(path_to_scss(workspace))}, css: ${build_require(path_to_css(workspace))} };`)
            .join('\n')}` +
        `\n\nexport default {\n` +
        `${SELECTIVE_BUILD_WORKSPACES.map((workspace) => `    ${to_var(workspace)},`).join('\n')}\n` +
        `};\n`;

    fs.writeFileSync(path.resolve(PATH_INTERNAL_CODEGEN, `webpack.styles.ts`), export_contents);
};

main();
