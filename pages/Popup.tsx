import React from 'react';
import { useDebounce } from 'usehooks-ts';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className='rounded-md p-7'>
            {children}
        </div>
    );
};

function ToggleWorkMode(props: { task: hooks.InProgressTask }) {
    const { task } = props;
    const isWorkMode = task?.mode === 'WORK';

    /* ---------------------------------- STATE --------------------------------- */
    const [toggled, setToggled] = React.useState(isWorkMode);
    // This could use more thought. 
    // For now, I think it makes sense to revert the toggle 
    // if it's found to not match after 3 seconds of no changes.
    const debouncedIsWorkMode = useDebounce(isWorkMode, 3000);
    React.useEffect(() => {
        setToggled(debouncedIsWorkMode);
    }, [debouncedIsWorkMode]);

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const pauseMutation = hooks.usePause();
    const resumeMutation = hooks.useResume();

    /* --------------------------------- HELPERS -------------------------------- */
    const mutationLoading = pauseMutation.isLoading || resumeMutation.isLoading;

    /* -------------------------------- HANDLERS -------------------------------- */
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

    /* --------------------------------- RENDER --------------------------------- */
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
    /* ------------------------------ REACT QUERIES ----------------------------- */
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    
    /* --------------------------------- RENDER --------------------------------- */
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
