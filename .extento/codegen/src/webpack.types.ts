export type WorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export const workspace_names: Array<WorkspaceName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export type SelectiveBuilds = 'QA' | 'BOSS' | 'NEW_GUY' | 'CEO'

export const selective_builds: { [key in SelectiveBuilds]: Array<WorkspaceName> } = {
    QA: ['tester', 'candidate'],
    BOSS: ['manager', 'admin'],
    NEW_GUY: ['devops', 'candidate'],
    CEO: ['admin', 'candidate', 'manager', 'tester']
};