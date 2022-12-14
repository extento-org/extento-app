import React from 'react';
import WorkspaceUiOverlay from '@_core/react.workspaceUiOverlay';
import { UI_ORDERING, WorkspaceName, WORKSPACE_NAMES } from '@extento.types';
import { CodegenStyles } from '@_core/common.types';
import render_shadow_root from '@_core/content.renderShadowRoot';
import constants from '@_core/constants';
import GlobalContext from '@_core/react.contextGlobal';

const sharedCss = require('@_styles/global.css');
const workspacesCss = require('@_styles/workspaces.css');
const sharedScss = require('@_styles/global.scss');
const workspacesScss = require('@_styles/workspaces.scss');

export const getWorkspaceId = (workspace_name: WorkspaceName) => `${workspace_name}-${constants.DOM_ID_SHADOW_ROOT}`;

function createWorkspaceRoots(
    workspace_context: {
        [key in WorkspaceName]: any
    },
    styles: CodegenStyles,
) {
    WORKSPACE_NAMES.map((workspace_name) => {
        const { css, scss } = styles[workspace_name];
        const { FunctionalComponent } = workspace_context[workspace_name];
        return render_shadow_root({
            css: `${sharedCss}\n\n${sharedScss}\n\n${workspacesCss}\n\n${workspacesScss}\n\n${css}\n\n${scss}`,
            id: getWorkspaceId(workspace_name),
            children: (
                <GlobalContext>
                    <WorkspaceUiOverlay offset={UI_ORDERING.indexOf(workspace_name)}>
                        <FunctionalComponent />
                    </WorkspaceUiOverlay>
                </GlobalContext>
            ),
        });
    });
}

export default createWorkspaceRoots;
