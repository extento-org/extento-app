const fs = require('fs');
const path = require('path');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');

const getStylesheets = () => {
    const printFunctionCall = (workspace) => `const ${workspace} = setupWorkspaceContexts<typeof states['${workspace}']['default']>('${workspace}', states.${workspace}.default, uis.${workspace}.default);`;

    const exportContents = `// @ts-nocheck\n\n`
        + `import states from '@_codegen/webpack.states';\n`
        + `import uis from '@_codegen/webpack.uis';\n`
        + `import setupWorkspaceContexts from '@extento.api/react.setupWorkspaceContexts';\n\n`
        + `${constants.SELECTIVE_BUILD_WORKSPACES
            .map(printFunctionCall)
            .join('\n')}`
        + `\n\nexport default {\n`
        + `${constants.SELECTIVE_BUILD_WORKSPACES.map((workspace) => `    ${toVar(workspace)},`).join('\n')}\n`
        + `};\n`;

    fs.writeFileSync(path.resolve(constants.PATH_INTERNAL_CODEGEN, 'webpack.workspaceContexts.ts'), exportContents);

    vLog(`generated workspace contexts`);
};

module.exports = getStylesheets;
