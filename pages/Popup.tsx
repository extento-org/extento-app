import React from 'react';
import { useDebounce } from 'usehooks-ts';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import Toggle from '@app.shared/components/Toggle';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
};

function ToggleWorkMode(props: { task: hooks.InProgressTask }) {
    const { task } = props;
    const isWorkMode = task.mode === 'WORK';

    const [toggled, setToggled] = React.useState(isWorkMode);

    // After 3 seconds we assume isWorkMode has updated correctly.
    // We could use onSuccess or onError handlers in mutations below
    // but this method ensures correctness no matter what weirdness.
    // If I had more time I'd figure out all the possible ways a call 
    // to the worker API could fail or be delayed indefinitely.
    // Under ideal conditions the setToggled in the below useEffect 
    // changes nothing about this function component's state
    const debouncedIsWorkMode = useDebounce(isWorkMode, 3000);
    React.useEffect(() => {
        setToggled(debouncedIsWorkMode);
    }, [debouncedIsWorkMode]);

    const pauseMutation = hooks.usePause();
    const resumeMutation = hooks.useResume();
    const mutationLoading = pauseMutation.isLoading || resumeMutation.isLoading;

    // based on the current toggle state, either pause or resume
    const handleOnChange = React.useCallback(() => {
        if (mutationLoading) {
            return;
        }
        setToggled(last => !last);
        if (toggled) {
            pauseMutation.mutate()
        } else {
            resumeMutation.mutate()
        }
    }, [toggled, mutationLoading]);

    if (!!task) {
        return (
            <Toggle
                disabled={mutationLoading}
                enabled={toggled}
                onChange={handleOnChange}/>
        );
    }
    return (
        <p>
            No active task
        </p>
    );
};

export default function Popup() {
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    return (
        <ReactQueryProvider>
            <Container>
                {isLoadingTask ? null : (<ToggleWorkMode task={task}/>)}
            </Container>
        </ReactQueryProvider>
    );
};
