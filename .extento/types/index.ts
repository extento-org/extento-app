export type AllLayerName = '__template__'

export type LayerName = '__template__'

export const LAYER_NAMES: Array<LayerName> = [
    '__template__'
];

export const ALL_LAYER_NAMES: Array<AllLayerName> = [
    '__template__'
];

export type SelectiveBuild = 'master'

export const SELECTIVE_BUILDS: { [key in SelectiveBuild]: Array<AllLayerName> } = {
    master: ['__template__']
};

export const SELECTIVE_BUILD: SelectiveBuild = 'master';

export const UI_ORDERING: Array<LayerName> = ['__template__'];