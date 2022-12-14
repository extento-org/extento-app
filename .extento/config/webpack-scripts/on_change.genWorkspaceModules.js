const fs = require('fs');
const path = require('path');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');
const formattedSupportedExports = constants.CODE_GEN_WORKSPACE_EXPORTS
    .map((str) => [str.split('.')[0], str]);
const printPluralize = (str) => (str.endsWith('s') ? `${str}es` : `${str}s`);

const genWorkspaceModules = () => {
    formattedSupportedExports.forEach(([name, importName = name]) => {
        const requiresExtInImport = importName.endsWith('.json');
        const fixedImportName = requiresExtInImport ? importName : name;

        const moduleExists = (dir) => fs.existsSync(
            path.resolve(constants.PATH_APP, `workspaces/${dir}/${importName}`),
        );

        const enabledWorkspaces = constants.SELECTIVE_BUILD_WORKSPACES
            .filter((workspace) => moduleExists(workspace));

        const buildExportLine = (workspace) => `${toVar(workspace)}`;

        const exportContents = `// @ts-nocheck\n\n`
            + `${enabledWorkspaces
                .map((workspace) => `import * as ${toVar(workspace)} from '@_workspace/${workspace}/${fixedImportName}';`)
                .filter((e) => !!e)
                .join('\n')}`
            + `\n\nexport default {\n`
            + `${enabledWorkspaces.map((workspace) => `    ${buildExportLine(workspace)},`).join('\n')}\n`
            + `};\n`;

        fs.writeFileSync(
            path.resolve(constants.PATH_INTERNAL_CODEGEN, `webpack.${printPluralize(name)}.ts`),
            exportContents,
        );
        vLog(`generated ${printPluralize(name)} workspace code`);
    });

    vLog(`generated all workspace code`);
};

module.exports = genWorkspaceModules;
