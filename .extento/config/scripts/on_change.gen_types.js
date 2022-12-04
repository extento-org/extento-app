const fs = require('fs');

const { WORKSPACES, USER_CONFIG_PATH, GENERATED_TYPES_PATH } = require('../constants.js');

const to_var = str => str.split('-').join('_');
const print_arr = arr => `[${arr.map(el => `'${el}'`).join(', ')}]`;

const main = async () => {
    let contents =
        `export type WorkspaceName = ${WORKSPACES.map((workspace) => `'${to_var(workspace)}'`).join(' | ')}\n\n`
        + `export const workspace_names: Array<WorkspaceName> = [\n` +
        `${WORKSPACES.map((workspace) => `    '${to_var(workspace)}'`).join(',\n')}\n` +
        `];`;

    const { selective_builds } = require(USER_CONFIG_PATH);
    const build_names = Object.keys(selective_builds);
    contents = contents + 
        `\n\nexport type SelectiveBuilds = ${build_names.map((name) => `'${to_var(name)}'`).join(' | ')}\n\n`
        + `export const selective_builds: { [key in SelectiveBuilds]: Array<WorkspaceName> } = {\n` +
        `${build_names.map((name) => `    ${to_var(name)}: ${print_arr(selective_builds[name])}`).join(',\n')}\n` +
        `};`;

    fs.writeFileSync(GENERATED_TYPES_PATH, contents);
};

main();