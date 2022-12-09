const fs = require('fs');

const {
    SELECTIVE_BUILD,
    SELECTIVE_BUILDS,
    SELECTIVE_BUILD_WORKSPACES,
    SELECTIVE_BUILDS_CONFIG,
    PATH_APP_CONFIG,
    PATH_INTERNAL_TYPES,
    WORKSPACES
} = require('../constants.js');

const to_var = str => str.split('-').join('_');
const print_arr = arr => `[${arr.map(el => `'${el}'`).join(', ')}]`;

const main = async () => {
    // workspaces
    let contents = `export type AllWorkspaceName = ${WORKSPACES.map((workspace) => `'${to_var(workspace)}'`).join(' | ')}`
        + `\n\nexport type WorkspaceName = ${SELECTIVE_BUILD_WORKSPACES.map((workspace) => `'${to_var(workspace)}'`).join(' | ')}\n\n`
        + `export const workspace_names: Array<WorkspaceName> = [\n` +
        `${SELECTIVE_BUILD_WORKSPACES.map((workspace) => `    '${to_var(workspace)}'`).join(',\n')}\n` +
        `];`
        + `\n\nexport const all_workspace_names: Array<AllWorkspaceName> = [\n` +
        `${WORKSPACES.map((workspace) => `    '${to_var(workspace)}'`).join(',\n')}\n` +
        `];`;

    // selective builds
    const user_config = require(PATH_APP_CONFIG);
    contents = contents
        + `\n\nexport type SelectiveBuild = ${SELECTIVE_BUILDS.map((name) => `'${to_var(name)}'`).join(' | ')}\n\n`
        + `export const selective_builds: { [key in SelectiveBuild]: Array<AllWorkspaceName> } = {\n` +
        `${SELECTIVE_BUILDS.map((build_name) => `    ${to_var(build_name)}: ${print_arr(SELECTIVE_BUILDS_CONFIG[build_name])}`).join(',\n')}\n` +
        `};\n\n`
        + `export const SELECTIVE_BUILD: SelectiveBuild = '${SELECTIVE_BUILD}';\n\n`;

    // ui ordering
    const { ui_ordering } = user_config;
    const WORKSPACES_UI_ORDERED = ui_ordering.filter(workspace => SELECTIVE_BUILD_WORKSPACES.includes(workspace));
    contents = contents
        + `export const ui_ordering: Array<WorkspaceName> = ${print_arr(WORKSPACES_UI_ORDERED)};`;
        
    fs.writeFileSync(PATH_INTERNAL_TYPES, contents);
};
main();
