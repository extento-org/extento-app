const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');

const genLayerContexts = () => {
    const printFunctionCall = (layer) => `const ${layer} = setupLayerContexts<typeof states['${layer}']['default']>('${layer}', states.${layer}.default, uis.${layer}.default);`;

    const exportContents = `// @ts-nocheck\n\n`
        + `import states from '@_codegen/webpack.states';\n`
        + `import uis from '@_codegen/webpack.uis';\n`
        + `import setupLayerContexts from '@bridge.codegen/react.setupLayerContexts';\n\n`
        + `${constants.SELECTIVE_BUILD_LAYERS
            .map(printFunctionCall)
            .join('\n')}`
        + `\n\nexport default {\n`
        + `${constants.SELECTIVE_BUILD_LAYERS.map((layer) => `    ${toVar(layer)},`).join('\n')}\n`
        + `};\n`;

    fs.writeFileSync(path.resolve(constants.PATH_INTERNAL_CODEGEN, 'webpack.layerContexts.ts'), exportContents);

    log.info(`generated layer contexts`);
};

module.exports = genLayerContexts;
