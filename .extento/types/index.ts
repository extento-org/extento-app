export type AllWorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export type WorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export const WORKSPACE_NAMES: Array<WorkspaceName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export const ALL_WORKSPACE_NAMES: Array<AllWorkspaceName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export type SelectiveBuild = 'qa' | 'boss' | 'new_guy' | 'ceo' | 'master'

export const SELECTIVE_BUILDS: { [key in SelectiveBuild]: Array<AllWorkspaceName> } = {
    qa: ['tester', 'candidate'],
    boss: ['manager', 'admin'],
    new_guy: ['devops', 'candidate'],
    ceo: ['admin', 'candidate', 'manager', 'tester'],
    master: ['admin', 'candidate', 'devops', 'manager', 'tester']
};

export const SELECTIVE_BUILD: SelectiveBuild = 'master';

export const UI_ORDERING: Array<WorkspaceName> = ['admin', 'tester', 'manager', 'candidate', 'devops'];