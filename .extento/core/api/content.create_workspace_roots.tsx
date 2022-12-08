import React from 'react';
import WorkspaceUiOverlay from '@_core/react.workspace_ui_overlay';
import { ui_ordering, WorkspaceName, workspace_names } from '@extento.types';
import { CodegenStylesheets, CodegenUis } from '@_core/common.types';
import render_shadow_root from '@_core/content.render_shadow_root';
import constants from '@_core/constants';
import GlobalContext from '@_core/react.context_global';

export const get_workspace_id = (workspace_name: WorkspaceName) => 
    workspace_name + '-' + constants.DOM_ID_SHADOW_ROOT;

const render_workspaces = (uis: CodegenUis, workspace_stylesheets: CodegenStylesheets) => {
    workspace_names.map((workspace_name) => {
        const FunctionalComponent = uis[workspace_name]?.default;
        const { css, scss } = workspace_stylesheets[workspace_name];

        render_shadow_root({
            scss,
            css,
            id: get_workspace_id(workspace_name),
            children: (
                <GlobalContext>
                    <WorkspaceUiOverlay offset={ui_ordering.indexOf(workspace_name)}>
                        <FunctionalComponent />
                    </WorkspaceUiOverlay>
                </GlobalContext>
            ),
        })
    })
};

export default render_workspaces;