const fs = require('fs');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');
const printArr = (arr) => `[${arr.map((el) => `'${el}'`).join(', ')}]`;

const genTypes = () => {
    // workspaces
    let contents = `export type AllWorkspaceName = ${constants.WORKSPACES.map((workspace) => `'${toVar(workspace)}'`).join(' | ')}`
        + `\n\nexport type WorkspaceName = ${constants.SELECTIVE_BUILD_WORKSPACES.map((workspace) => `'${toVar(workspace)}'`).join(' | ')}\n\n`
        + `export const WORKSPACE_NAMES: Array<WorkspaceName> = [\n`
        + `${constants.SELECTIVE_BUILD_WORKSPACES.map((workspace) => `    '${toVar(workspace)}'`).join(',\n')}\n`
        + `];`
        + `\n\nexport const ALL_WORKSPACE_NAMES: Array<AllWorkspaceName> = [\n`
        + `${constants.WORKSPACES.map((workspace) => `    '${toVar(workspace)}'`).join(',\n')}\n`
        + `];`;

    // selective builds
    contents += `\n\nexport type SelectiveBuild = ${constants.SELECTIVE_BUILDS.map((name) => `'${toVar(name)}'`).join(' | ')}\n\n`
        + `export const SELECTIVE_BUILDS: { [key in SelectiveBuild]: Array<AllWorkspaceName> } = {\n`
        + `${constants.SELECTIVE_BUILDS.map((buildName) => `    ${toVar(buildName)}: ${printArr(constants.SELECTIVE_BUILDS_CONFIG[buildName].workspaces)}`).join(',\n')}\n`
        + `};\n\n`
        + `export const SELECTIVE_BUILD: SelectiveBuild = '${constants.SELECTIVE_BUILD}';\n\n`;

    // ui ordering
    const WORKSPACES_UI_ORDERED = constants.USER_CONFIG.ui_ordering
        .filter((workspace) => constants.SELECTIVE_BUILD_WORKSPACES.includes(workspace));

    contents += `export const UI_ORDERING: Array<WorkspaceName> = ${printArr(WORKSPACES_UI_ORDERED)};`;

    fs.writeFileSync(constants.PATH_INTERNAL_TYPES, contents);

    vLog(`generated extento types`);
};

module.exports = genTypes;
