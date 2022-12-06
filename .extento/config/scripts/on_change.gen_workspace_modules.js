const fs = require('fs');
const path = require('path');

const {
    CODE_GEN_WORKSPACE_EXPORTS,
    PATH_INTERNAL_CODEGEN,
    PATH_APP,
    WORKSPACES,
} = require('../constants.js');

const to_var = str => str.split('-').join('_');
const formatted_supported_exports = CODE_GEN_WORKSPACE_EXPORTS.map(str => [str.split('.')[0], str]);
const pluralize_suffix = (str) => str.endsWith('s') ? `${str}es` : `${str}s`;

const main = () => {
    formatted_supported_exports.forEach(([name, import_name = name]) => {
        const requires_ext_in_import = import_name.endsWith('.json');
        const fixed_import_name = requires_ext_in_import ? import_name : name;

        const module_exists = (dir) => fs.existsSync(
            path.resolve(PATH_APP, `workspaces/${dir}/${import_name}`)
        );

        const enabled_workspaces = WORKSPACES
            .filter(workspace => module_exists(workspace));

        const build_export_line = (workspace) => {
            return `${to_var(workspace)}: ${name}<typeof ${to_var(workspace)}>('${to_var(workspace)}', ${to_var(workspace)})`;
        };

        const export_contents = `import { ${name} } from '@extento.api/utils.strip_build';\n\n` +
            `${enabled_workspaces
                .map((workspace) => `import * as ${to_var(workspace)} from '@_workspace/${workspace}/${fixed_import_name}';`)
                .filter(e => e)
                .join('\n')}` +
            `\n\nexport default {\n` +
            `${enabled_workspaces.map((workspace) => `    ${build_export_line(workspace)},`).join('\n')}\n` +
            `};\n`;

        fs.writeFileSync(path.resolve(PATH_INTERNAL_CODEGEN, `webpack.${pluralize_suffix(name)}.ts`), export_contents);
    });
};
main();
