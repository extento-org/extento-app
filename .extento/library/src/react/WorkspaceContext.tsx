import { noop } from 'lodash';
import React from 'react';

type UIState<WorkspaceUIStates> = WorkspaceUIStates[keyof WorkspaceUIStates];

type SetState<WorkspaceUIStates> = React.Dispatch<
    React.SetStateAction<Partial<UIState<WorkspaceUIStates>>>
>;

type ApplyState<WorkspaceUIStates> = (
    typeof noop
        | ((state_name: keyof WorkspaceUIStates) => UIState<WorkspaceUIStates>)
);

export function create_context<WorkspaceUIStates>(
    state: UIState<WorkspaceUIStates>,
): React.Context<{
    set: SetState<WorkspaceUIStates>,
    apply_state: ApplyState<WorkspaceUIStates>,
} & UIState<WorkspaceUIStates>> {
    return React.createContext({
        ...state,
        set: noop,
        apply_state: noop,
    });
}

export function Provider<WorkspaceUIStates>(props: {
    context: React.Context<any>,
    states: WorkspaceUIStates,
    children: React.ReactNode,
}) {
    const untyped_states: any = props.states;
    const [state, set_state] = React.useState<
        UIState<WorkspaceUIStates>
    >(untyped_states.initial);

    const value: {
        apply_state: ApplyState<WorkspaceUIStates>,
        set: SetState<WorkspaceUIStates>,
    } & UIState<WorkspaceUIStates> = {
        ...state,
        apply_state: (state_name: keyof WorkspaceUIStates) => set_state(untyped_states[state_name]),
        set: (
            arg1: Partial<UIState<WorkspaceUIStates>> | (
                (last: UIState<WorkspaceUIStates>) =>
                    UIState<WorkspaceUIStates>
            ),
        ) => set_state(
            (last: any) => {
                let slice = arg1;
                if (typeof arg1 === 'function') {
                    slice = arg1(last);
                }

                return { ...last, ...slice };
            },
        ),
    };

    return (
        <props.context.Provider value={value}>
            {props.children}
        </props.context.Provider>
    );
}