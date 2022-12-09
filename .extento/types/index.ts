export type AllWorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export type WorkspaceName = 'manager' | 'admin'

export const workspace_names: Array<WorkspaceName> = [
    'manager',
    'admin'
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

export const SELECTIVE_BUILD: SelectiveBuild = 'BOSS';

export const ui_ordering: Array<WorkspaceName> = ['admin', 'manager'];