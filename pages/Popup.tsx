/* -------------------------------------------------------------------------- */
/*                              REQUIRES TESTING                              */
/* -------------------------------------------------------------------------- */

import React from 'react';
import { useDebounce } from 'usehooks-ts';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className='overflow-hidden rounded-md p-7'>
            {children}
        </div>
    );
};

function ToggleWorkMode(props: { task: hooks.InProgressTask }) {
    const { task } = props;
    const isWorkMode = task?.mode === 'WORK';

    const [toggled, setToggled] = React.useState(isWorkMode);

    // After 3 seconds we assume isWorkMode has updated correctly.
    // We could use onSuccess or onError handlers in mutations below
    // but this method ensures correctness.
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

    if (toggled) {
        return (
            <button 
                disabled={mutationLoading}
                onClick={() => handleOnChange()}
                className='btn btn-warning w-60'>
                    Stop Working
            </button>
        );
    }

    return (
        <button 
            disabled={mutationLoading}
            onClick={() => handleOnChange()}
            className='btn btn-success w-60'>
                Start Working
        </button>
    );
};

function NoTaskMessage() {
    return (
        <button 
            disabled={true}
            className='btn btn-outline w-60'>
                No Active Task
        </button>
    );
};

function PopupPage() {
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    return(
        <Container>
            {isLoadingTask ? null : (
                !!task ? (
                    <ToggleWorkMode task={task}/>
                ) : (
                    <NoTaskMessage />
                )
            )}
        </Container>
    );
};

export default function Popup() {
    return (
        <ReactQueryProvider>
            <PopupPage />
        </ReactQueryProvider>
    );
};
