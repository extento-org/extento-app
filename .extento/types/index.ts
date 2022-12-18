export type AllLayerName = 'badger'

export type LayerName = 'badger'

export const LAYER_NAMES: Array<LayerName> = [
    'badger'
];

export const ALL_LAYER_NAMES: Array<AllLayerName> = [
    'badger'
];

export type SelectiveBuild = 'master'

export const SELECTIVE_BUILDS: { [key in SelectiveBuild]: Array<AllLayerName> } = {
    master: ['badger']
};

export const SELECTIVE_BUILD: SelectiveBuild = 'master';

export const UI_ORDERING: Array<LayerName> = ['badger'];