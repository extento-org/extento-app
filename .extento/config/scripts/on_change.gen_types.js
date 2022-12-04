const fs = require('fs');
const { SELECTIVE_BUILDS, WORKSPACES, USER_CONFIG_PATH, GENERATED_TYPES_PATH } = require('../constants.js');
const to_var = str => str.split('-').join('_');
const print_arr = arr => `[${arr.map(el => `'${el}'`).join(', ')}]`;
const main = async () => {
    // workspaces
    let contents = `export type WorkspaceName = ${WORKSPACES.map((workspace) => `'${to_var(workspace)}'`).join(' | ')}\n\n`
        + `export const workspace_names: Array<WorkspaceName> = [\n` +
        `${WORKSPACES.map((workspace) => `    '${to_var(workspace)}'`).join(',\n')}\n` +
        `];`;
    // selective builds
    const user_config = require(USER_CONFIG_PATH);
    const { selective_builds } = user_config;
    contents = contents +
        `\n\nexport type SelectiveBuild = ${SELECTIVE_BUILDS.map((name) => `'${to_var(name)}'`).join(' | ')}\n\n`
        + `export const selective_builds: { [key in SelectiveBuild]: Array<WorkspaceName> } = {\n` +
        `${SELECTIVE_BUILDS.map((name) => `    ${to_var(name)}: ${print_arr(selective_builds[name] || WORKSPACES)}`).join(',\n')}\n` +
        `};\n\n`
        + `const _ACTIVE_SELECTIVE_BUILD: any = process.env.EXTENTO_SELECTIVE_BUILD;\n`
        + `export const ACTIVE_SELECTIVE_BUILD: SelectiveBuild = _ACTIVE_SELECTIVE_BUILD;\n\n`;
    // ui ordering
    const { ui_ordering } = user_config;
    contents = contents
        + `export const ui_ordering: Array<WorkspaceName> = ${print_arr(ui_ordering)};`;
    fs.writeFileSync(GENERATED_TYPES_PATH, contents);
};
main();
