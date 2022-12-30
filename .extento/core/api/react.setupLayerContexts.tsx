import { noop } from 'lodash';
import React from 'react';
import { LayerName } from '@ex.compiled';

type Set<LayerUIStates> = (
    typeof noop
        | (
            (
                state_name: keyof LayerUIStates,
                val: React.SetStateAction<Partial<LayerUIStates[typeof state_name]>>,
            ) => void
        )
);

function createContext<LayerUIStates>(
    state: LayerUIStates[keyof LayerUIStates],
): React.Context<{
        set: Set<LayerUIStates>,
        state: LayerUIStates[keyof LayerUIStates]
    }> {
    return React.createContext({
        state,
        set: noop,
    });
}

function Provider<State>(props: {
    context: React.Context<any>,
    state: State,
    children: React.ReactNode,
}) {
    const { state, context, children } = props;

    const untypedUiState: any = state;
    const INITIAL_KEY = 'initial';

    const [providerState, setProviderState] = React.useState<{
        state: State[keyof State],
        key: keyof State | typeof INITIAL_KEY,
    }>({
        state: untypedUiState[INITIAL_KEY],
        key: INITIAL_KEY,
    });

    const set = React.useCallback(
        (
            state_name: keyof State,
            val?: React.SetStateAction<Partial<State[typeof state_name]>>,
        ) => setProviderState(val ? (
            (last: { state: any, key: keyof State }) => {
                let previousState: any = last.state;
                if (last.key !== state_name) {
                    previousState = untypedUiState[state_name];
                }
                let slice = val;
                if (typeof val === 'function') {
                    slice = val(previousState);
                }
                return {
                    ...last,
                    state: { ...previousState, ...slice },
                };
            }
        ) : { key: state_name, state: untypedUiState[state_name] }),
        [untypedUiState],
    );

    const value: {
        set: Set<State>,
        state: State[keyof State],
    } = React.useMemo(() => ({
        state: providerState.state,
        set,
    }), [providerState]);

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    );
}

function setupLayer<State>(
    layer_name: LayerName,
    typed_ui_state: State,
    components: Array<React.FunctionComponent>,
) {
    const state: any = typed_ui_state;
    const context = createContext<State>(state.initial);

    return {
        use: () => React.useContext(context),
        context,
        FunctionalComponent: function FunctionalComponent(props: any) {
            return (
                <Provider<State>
                    state={typed_ui_state}
                    context={context}
                >
                    {components.map((FunctionComponent, i) => (
                        <FunctionComponent {...props} key={`${layer_name}-${i}`} />
                    ))}
                </Provider>
            );
        },
    };
}

export default setupLayer;
