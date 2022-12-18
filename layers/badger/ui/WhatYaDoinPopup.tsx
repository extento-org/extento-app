import React from 'react';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
};

function CurrentTask(props: { task: hooks.InProgressTask }) {
    const countdown = hooks.useCountdownQuery();
    
    return (
        <div>
            
        </div>
    );
};

// TODO: ui.Instructions
function Instructions() {
    return (
        <div>
            
        </div>
    );
};

function Actions() {
    const editTaskMutation = hooks.useEditTask();
    const extendTaskMutation = hooks.useExtendTask();
    const giveUpTaskMutation = hooks.useGiveUpTask();
    const pauseTaskMutation = hooks.usePause();
    const resumeTaskMutation = hooks.useResume();
    return (
        <div>
            
        </div>
    );
};

const Popup = () => {
    const { 
        isLoading: isLoadingBlacklisted,
        blacklisted,
    } = hooks.useBlacklistedQuery(
        window.href,
    );
    const { isLoading: isLoadingTask, task } = hooks.useTask(
        !isLoadingBlacklisted && !blacklisted
    );
    const siteIsBlacklisted = !isLoadingBlacklisted && blacklisted;
    const showTask = !isLoadingTask && !!task;

    if (siteIsBlacklisted && showTask) {
        return(
            <Container>
                <>
                    <CurrentTask task={task} />
                    <Instructions />
                    <Actions />
                </>
            </Container>
        );
    }
    return null;
};

export default Popup;
