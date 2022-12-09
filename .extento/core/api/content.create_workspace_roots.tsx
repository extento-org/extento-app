import React from 'react';
import WorkspaceUiOverlay from '@_core/react.workspace_ui_overlay';
import { ui_ordering, WorkspaceName, workspace_names } from '@extento.types';
import { CodegenStyles, CodegenUis } from '@_core/common.types';
import render_shadow_root from '@_core/content.render_shadow_root';
import constants from '@_core/constants';
import GlobalContext from '@_core/react.context_global';

const shared_css = require('@_styles/global.css');
const workspaces_css = require('@_styles/workspaces.css');
const shared_scss = require('@_styles/global.scss');
const workspaces_scss = require('@_styles/workspaces.scss');

export const get_workspace_id = (workspace_name: WorkspaceName) => 
    workspace_name + '-' + constants.DOM_ID_SHADOW_ROOT;

const render_workspaces = (uis: CodegenUis, styles: CodegenStyles) => {
    workspace_names.map((workspace_name) => {
        const FunctionalComponent = uis[workspace_name]?.default;
        const { css, scss } = styles[workspace_name];
        render_shadow_root({
            css: shared_css + '\n\n' + shared_scss + '\n\n' + workspaces_css + '\n\n' + workspaces_scss + '\n\n' + css + '\n\n' + scss,
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