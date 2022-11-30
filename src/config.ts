import { WorkspaceName, workspace_names } from "@codegen/webpack.workspaces";

export type Build = 'QA' | 'BOSS' | 'NEW_GUY' | 'CEO' | 'MASTER';
export type WorkspaceBuilds = {
    [key in Build]: Array<WorkspaceName>
};

export const builds: WorkspaceBuilds = {
    QA: [
        "tester",
        "candidate"
    ],
    BOSS: [
        "manager",
        "admin"
    ],
    NEW_GUY: [
        "devops",
        "candidate"
    ],
    CEO: [
        "admin",
        "candidate",
        "manager",
        "tester"
    ],
    MASTER: workspace_names
};