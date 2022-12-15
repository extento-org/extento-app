export type AllLayerName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export type LayerName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export const LAYER_NAMES: Array<LayerName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export const ALL_LAYER_NAMES: Array<AllLayerName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export type SelectiveBuild = 'qa' | 'boss' | 'new_guy' | 'ceo' | 'master'

export const SELECTIVE_BUILDS: { [key in SelectiveBuild]: Array<AllLayerName> } = {
    qa: ['tester', 'candidate'],
    boss: ['manager', 'admin'],
    new_guy: ['devops', 'candidate'],
    ceo: ['admin', 'candidate', 'manager', 'tester'],
    master: ['admin', 'candidate', 'devops', 'manager', 'tester']
};

export const SELECTIVE_BUILD: SelectiveBuild = 'master';

export const UI_ORDERING: Array<LayerName> = ['admin', 'tester', 'manager', 'candidate', 'devops'];