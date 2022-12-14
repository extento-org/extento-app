import { noop } from 'lodash';
import React from 'react';
import { WorkspaceName } from '@extento.types';

type UIState<WorkspaceUIStates> = WorkspaceUIStates[keyof WorkspaceUIStates];

type SetState<WorkspaceUIStates> = React
    .Dispatch<React.SetStateAction<Partial<UIState<WorkspaceUIStates>>>>;

type ApplyState<WorkspaceUIStates> = (
    typeof noop
        | ((state_name: keyof WorkspaceUIStates) => UIState<WorkspaceUIStates>)
);

function createContext<WorkspaceUIStates>(
    state: UIState<WorkspaceUIStates>,
): React.Context<{
        set: SetState<WorkspaceUIStates>,
        applyState: ApplyState<WorkspaceUIStates>,
    } & UIState<WorkspaceUIStates>> {
    return React.createContext({
        ...state,
        set: noop,
        applyState: noop,
    });
}

function Provider<State>(props: {
    context: React.Context<any>,
    state: State,
    children: React.ReactNode,
}) {
    const { state, context, children } = props;

    const untypedUiState: any = state;

    const [providerState, setProviderState] = React.useState<UIState<State>>(
        untypedUiState.initial,
    );

    const applyState = React.useCallback(
        (state_name: keyof State) => setProviderState(untypedUiState[state_name]),
        [untypedUiState],
    );

    const set = React.useCallback((
        arg1: Partial<UIState<State>> | (
            (last: UIState<State>) => UIState<State>
        ),
    ) => setProviderState(
        (last: any) => {
            let slice = arg1;
            if (typeof arg1 === 'function') {
                slice = arg1(last);
            }

            return { ...last, ...slice };
        },
    ), []);

    const value: {
        applyState: ApplyState<State>,
        set: SetState<State>,
        state: UIState<State>,
    } = React.useMemo(() => ({
        state: providerState,
        applyState,
        set,
    }), [providerState]);

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    );
}

function setupWorkspace<State>(
    workspace_name: WorkspaceName,
    typed_ui_state: State,
    components: Array<React.FunctionComponent>,
) {
    const state: any = typed_ui_state;
    const context = createContext<State>(state.initial);

    return {
        useStates: () => React.useContext(context),
        context,
        FunctionalComponent: function FunctionalComponent(props: any) {
            return (
                <Provider<State>
                    state={typed_ui_state}
                    context={context}
                >
                    {components.map((FunctionComponent, i) => (
                        <FunctionComponent {...props} key={`${workspace_name}-${i}`} />
                    ))}
                </Provider>
            );
        },
    };
}

export default setupWorkspace;
