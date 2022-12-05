import React from 'react';
import uis from '@_gen/webpack.uis';
import { WorkspaceName, ui_ordering } from '@extento/types';
import use_ui from '@extento/lib/react/use_ui';

import '@extento/lib/react/index.css';

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

export const EnabledUIs = () => {
    const app = React.useContext(GlobalAppContext);
    const components = app?.enabled?.reduce(
        (
            accum: Array<[React.FunctionComponent<any>, WorkspaceName]>,
            workspace_name: WorkspaceName,
        ) => accum.concat([[uis[workspace_name]?.default, workspace_name]]),
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
