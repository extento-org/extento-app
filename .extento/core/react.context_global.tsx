import React from 'react';
import { WorkspaceName, ui_ordering } from '@extento.types';
import { CodegenUis } from '@_core/common.types';
import use_ui from '@_core/react.use_ui';

import '@_core/react/index.css';

type Output = ReturnType<typeof use_ui>;

const empty_context: Partial<Output> = {};
const GlobalAppContext = React.createContext<Partial<Output>>(empty_context);

const GlobalAppContextProvider = (props: {
    children: React.ReactNode
}) => {
    const app_hook_output = use_ui();
    return (
        <GlobalAppContext.Provider value={app_hook_output}>
            {props.children}
        </GlobalAppContext.Provider>
    );
};

export function EnabledUIs(props: { uis: CodegenUis }): any {
    const app = React.useContext(GlobalAppContext);
    const components = app?.enabled?.reduce(
        (
            accum: Array<[React.FunctionComponent<any>, WorkspaceName]>,
            workspace_name: WorkspaceName,
        ) => accum.concat([[props.uis[workspace_name]?.default, workspace_name]]),
        [],
    );
    
    return (
        <>
            {components?.map(([FunctionalComponent, workspace_name]) => {
                return (
                    <div 
                        style={{ zIndex: 100000 + ui_ordering.indexOf(workspace_name), }} 
                        className={`w-full h-full flex relative`} 
                        key={workspace_name}>
                        <FunctionalComponent />
                    </div>
                )
            })}
        </>
    );
};

const App = (props: { children: React.ReactNode }) => (
    <GlobalAppContextProvider>
        {props.children}
    </GlobalAppContextProvider>
);

export const use = (): Output => React.useContext<any>(GlobalAppContext);

export default App;