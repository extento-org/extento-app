import React from 'react';
import { WorkspaceName, workspace_names } from '@codegen/webpack.workspaces';
import manifest_matches_check from '@extento/shared/manifest_matches_check';

const use_ui = () => {
    const enabled = React.useMemo(() => workspace_names
        .filter((workspace_name: WorkspaceName) => manifest_matches_check(
            workspace_name,
            window?.location?.href,
        )), [window?.location?.href]);
    return {
        enabled,
    };
};

export default use_ui;
