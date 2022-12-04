import React from 'react';
import { WorkspaceName, workspace_names } from '@codegen/webpack.types';

const use_ui = (): { enabled: Array<WorkspaceName> } => {
    return {
        enabled: workspace_names
    };
};

export default use_ui;
