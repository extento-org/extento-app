const fs = require('fs');
const log = require('../utils/log');

const constants = require('../constants');

const toVar = (str) => str.split('-').join('_');
const printArr = (arr) => `[${arr.map((el) => `'${el}'`).join(', ')}]`;

const genTypes = () => {
    // layers
    let contents = `export type AllLayerName = ${constants.LAYERS.map((layer) => `'${toVar(layer)}'`).join(' | ')}`
        + `\n\nexport type LayerName = ${constants.SELECTIVE_BUILD_LAYERS.map((layer) => `'${toVar(layer)}'`).join(' | ')}\n\n`
        + `export const LAYER_NAMES: Array<LayerName> = [\n`
        + `${constants.SELECTIVE_BUILD_LAYERS.map((layer) => `    '${toVar(layer)}'`).join(',\n')}\n`
        + `];`
        + `\n\nexport const ALL_LAYER_NAMES: Array<AllLayerName> = [\n`
        + `${constants.LAYERS.map((layer) => `    '${toVar(layer)}'`).join(',\n')}\n`
        + `];`;

    // selective builds
    contents += `\n\nexport type SelectiveBuild = ${constants.SELECTIVE_BUILDS.map((name) => `'${toVar(name)}'`).join(' | ')}\n\n`
        + `export const SELECTIVE_BUILDS: { [key in SelectiveBuild]: Array<AllLayerName> } = {\n`
        + `${constants.SELECTIVE_BUILDS.map((buildName) => `    ${toVar(buildName)}: ${printArr(constants.SELECTIVE_BUILDS_CONFIG[buildName].layers)}`).join(',\n')}\n`
        + `};\n\n`
        + `export const SELECTIVE_BUILD: SelectiveBuild = '${constants.SELECTIVE_BUILD}';\n\n`;

    // ui ordering
    const LAYERS_UI_ORDERED = constants.USER_CONFIG.ui_ordering
        .filter((layer) => constants.SELECTIVE_BUILD_LAYERS.includes(layer));

    contents += `export const UI_ORDERING: Array<LayerName> = ${printArr(LAYERS_UI_ORDERED)};`;

    fs.writeFileSync(constants.PATH_INTERNAL_TYPES, contents);

    log.info(`generated extento types`);
};

module.exports = genTypes;
