import React from 'react';
import { Provider as WorkspaceContextProvider, create_context } from '@_package/react/WorkspaceContext';
import ui_states from '../ui_states';

const context = create_context<typeof ui_states>(ui_states.initial);

export const Provider = (props: { components: Array<React.ReactNode> }) => (
    <WorkspaceContextProvider<typeof ui_states> states={ui_states} context={context}>
        {props.components}
    </WorkspaceContextProvider>
);

export const use = () => React.useContext(context);
