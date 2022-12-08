import React from 'react';
import use_ui from '@_core/react.use_ui';

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

const App = (props: { children: React.ReactNode }) => (
    <GlobalAppContextProvider>
        {props.children}
    </GlobalAppContextProvider>
);

export const use = (): Output => React.useContext<any>(GlobalAppContext);

export default App;