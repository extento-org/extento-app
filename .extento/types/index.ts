export type WorkspaceName = 'admin' | 'candidate' | 'devops' | 'manager' | 'tester'

export const workspace_names: Array<WorkspaceName> = [
    'admin',
    'candidate',
    'devops',
    'manager',
    'tester'
];

export type SelectiveBuild = 'QA' | 'BOSS' | 'NEW_GUY' | 'CEO' | 'MASTER'

export const selective_builds: { [key in SelectiveBuild]: Array<WorkspaceName> } = {
    QA: ['tester', 'candidate'],
    BOSS: ['manager', 'admin'],
    NEW_GUY: ['devops', 'candidate'],
    CEO: ['admin', 'candidate', 'manager', 'tester'],
    MASTER: ['admin', 'candidate', 'devops', 'manager', 'tester']
};

const _ACTIVE_SELECTIVE_BUILD: any = process.env.EXTENTO_SELECTIVE_BUILD;
export const ACTIVE_SELECTIVE_BUILD: SelectiveBuild = _ACTIVE_SELECTIVE_BUILD;

export const ui_ordering: Array<WorkspaceName> = ['tester', 'manager', 'candidate', 'admin', 'devops'];