const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');
const formattedSupportedExports = constants.CODE_GEN_LAYER_EXPORTS
    .map((str) => [str.split('.')[0], str]);
const printPluralize = (str) => (str.endsWith('s') ? `${str}es` : `${str}s`);

const genLayerModules = () => {
    formattedSupportedExports.forEach(([name, importName = name]) => {
        const requiresExtInImport = importName.endsWith('.json');
        const fixedImportName = requiresExtInImport ? importName : name;

        const moduleExists = (dir) => fs.existsSync(
            path.resolve(constants.PATH_APP, `layers/${dir}/${importName}`),
        );

        const enabledLayers = constants.SELECTIVE_BUILD_LAYERS
            .filter((layer) => moduleExists(layer));

        const buildExportLine = (layer) => `${toVar(layer)}`;

        const exportContents = `// @ts-nocheck\n\n`
            + `${enabledLayers
                .map((layer) => `import * as ${toVar(layer)} from '@_layer/${layer}/${fixedImportName}';`)
                .filter((e) => !!e)
                .join('\n')}`
            + `\n\nexport default {\n`
            + `${enabledLayers.map((layer) => `    ${buildExportLine(layer)},`).join('\n')}\n`
            + `};\n`;

        fs.writeFileSync(
            path.resolve(constants.PATH_INTERNAL_CODEGEN, `webpack.${printPluralize(name)}.ts`),
            exportContents,
        );
        log.info(`generated ${printPluralize(name)} layer code`);
    });

    log.info(`generated all layer code`);
};

module.exports = genLayerModules;
