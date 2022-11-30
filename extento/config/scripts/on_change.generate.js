const fs = require('fs');
const path = require('path');

const shared = require('../shared');

const {
    WORKSPACES_NAMES_PATH,
    SUPPORTED_WORKSPACE_EXPORTS,
    WORKSPACES_CODEGEN_PATH,
    CHROME_EXTENSION_PATH,
    APP_PATH,
} = require('../constants.js');

const to_var = str => str.split('-').join('_');

const formatted_supported_exports = SUPPORTED_WORKSPACE_EXPORTS.map(
    str => [str.split('.')[0], str]
);

const pluralize_suffix = (str) => str.endsWith('s') ? `${str}es` : `${str}s`;

const remove_ext = str => str
    .split('.')
    .reverse().slice(1).reverse()
    .join('.')

const build_workspace_structure = async () => {
    const dirs = shared.get_workspace_dirs();
    formatted_supported_exports.forEach(([name, import_name = name]) => {
        const requires_ext_in_import = import_name.endsWith('.json');
        const fixed_import_name = requires_ext_in_import ? import_name : name;
        const module_exists = (dir) => fs.existsSync(
            path.resolve(APP_PATH, `workspaces/${dir}/${import_name}`)
        );
        const enabled_dirs = dirs
            .filter(dir => module_exists(dir));
        const build_export_line = (dir) => {
            return `${to_var(dir)}: ${name}<typeof ${to_var(dir)}>('${to_var(dir)}', ${to_var(dir)})`
        };
        const export_contents = 
            `import { ${name} } from '../utils/strip_build';\n\n` +
            `${enabled_dirs
            .map((dir) => `import * as ${to_var(dir)} from '@workspaces/${dir}/${fixed_import_name}';`)
            .filter(e => e)
            .join('\n')}` +
            `\n\nexport default {\n` +
            `${enabled_dirs.map((dir) => `    ${build_export_line(dir)},`).join('\n')}\n` +
            `};\n`;
        
        fs.writeFileSync(
            path.resolve(WORKSPACES_CODEGEN_PATH, `webpack.${pluralize_suffix(name)}.ts`), 
            export_contents
        );
    });
};

const build_workspace_names = async () => {
    const dirs = shared.get_workspace_dirs();
    const contents =
        `export type WorkspaceName = ${dirs.map((dir) => `'${to_var(dir)}'`).join(' | ')}\n\n`
        + `export const workspace_names: Array<WorkspaceName> = [\n` +
        `${dirs.map((dir) => `    '${to_var(dir)}'`).join(',\n')}\n` +
        `];`;
    fs.writeFileSync(WORKSPACES_NAMES_PATH, contents);
};

const copy_icons = async () => {
    const icons = shared.get_icons();
    
    icons.forEach(({ filepath, name }) => {
        const path_to_extension_icon = path.resolve(CHROME_EXTENSION_PATH, name);
        if (!fs.existsSync(path_to_extension_icon)) {
            fs.copyFileSync(filepath, path_to_extension_icon);
        }
    })
};

const main = async () => {
    await build_workspace_structure();
    await build_workspace_names();
    await copy_icons();
};

main();