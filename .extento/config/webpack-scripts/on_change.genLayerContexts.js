const fs = require('fs');
const path = require('path');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');

const getStylesheets = () => {
    const printFunctionCall = (layer) => `const ${layer} = setupLayerContexts<typeof states['${layer}']['default']>('${layer}', states.${layer}.default, uis.${layer}.default);`;

    const exportContents = `// @ts-nocheck\n\n`
        + `import states from '@_codegen/webpack.states';\n`
        + `import uis from '@_codegen/webpack.uis';\n`
        + `import setupLayerContexts from '@extento.internal-api/react.setupLayerContexts';\n\n`
        + `${constants.SELECTIVE_BUILD_LAYERS
            .map(printFunctionCall)
            .join('\n')}`
        + `\n\nexport default {\n`
        + `${constants.SELECTIVE_BUILD_LAYERS.map((layer) => `    ${toVar(layer)},`).join('\n')}\n`
        + `};\n`;

    fs.writeFileSync(path.resolve(constants.PATH_INTERNAL_CODEGEN, 'webpack.states.ts'), exportContents);

    vLog(`generated layer contexts`);
};

module.exports = getStylesheets;
