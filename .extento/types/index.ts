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

export type SelectiveBuild = 'QA' | 'BOSS' | 'NEW_GUY' | 'CEO' | 'MASTER'

export const selective_builds: { [key in SelectiveBuild]: Array<AllWorkspaceName> } = {
    QA: ['tester', 'candidate'],
    BOSS: ['manager', 'admin'],
    NEW_GUY: ['devops', 'candidate'],
    CEO: ['admin', 'candidate', 'manager', 'tester'],
    MASTER: ['admin', 'candidate', 'devops', 'manager', 'tester']
};

export const SELECTIVE_BUILD: SelectiveBuild = 'MASTER';

export const ui_ordering: Array<WorkspaceName> = ['admin', 'tester', 'manager', 'candidate', 'devops'];