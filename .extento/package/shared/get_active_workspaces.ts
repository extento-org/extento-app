import { WorkspaceName, workspace_names, selective_builds, ACTIVE_SELECTIVE_BUILD } from '@extento.types';

export const is_allowed = (workspace: WorkspaceName) => {
    return selective_builds[ACTIVE_SELECTIVE_BUILD].includes(workspace);
};

// this has to be a function otherwise we access values that aren't initialized
export default () => workspace_names.filter(name => is_allowed(name));