export type AllWorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export type WorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export const workspace_names: Array<WorkspaceName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export const all_workspace_names: Array<AllWorkspaceName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export type SelectiveBuild = 'qa' | 'boss' | 'new_guy' | 'ceo' | 'master'

export const selective_builds: { [key in SelectiveBuild]: Array<AllWorkspaceName> } = {
    qa: ['tester', 'candidate'],
    boss: ['manager', 'admin'],
    new_guy: ['devops', 'candidate'],
    ceo: ['admin', 'candidate', 'manager', 'tester'],
    master: ['admin', 'candidate', 'devops', 'manager', 'tester']
};

export const SELECTIVE_BUILD: SelectiveBuild = 'master';

export const ui_ordering: Array<WorkspaceName> = ['admin', 'tester', 'manager', 'candidate', 'devops'];