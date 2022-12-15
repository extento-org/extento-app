import React from 'react';
import use_ui from '@_core/react.useUi';

type Output = ReturnType<typeof use_ui>;

const emptyContext: Partial<Output> = {};
const GlobalAppContext = React.createContext<Partial<Output>>(emptyContext);

function GlobalAppContextProvider(props: {
    children: React.ReactNode
}) {
    const { children } = props;
    const ui = use_ui();
    return (
        <GlobalAppContext.Provider value={ui}>
            {children}
        </GlobalAppContext.Provider>
    );
}

function App(props: { children: React.ReactNode }) {
    const { children } = props;
    return (
        <GlobalAppContextProvider>
            {children}
        </GlobalAppContextProvider>
    );
}

export const use = (): Output => React.useContext<any>(GlobalAppContext);

export default App;
