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
    const { task } = props;
    const countdown = hooks.useCountdownQuery();
    const { text, mode } = task;

    return (
        <div className='flex flex-col border-spacing-2'>
            <label>MODE</label>
            <p>{mode}</p>
            <label>REMAINING TIME</label>
            <p>{countdown}</p>
            <label>TEXT</label>
            <p>{text}</p>
        </div>
    );
};

function Instructions() {
    return (
        <div className='flex flex-col border-spacing-2'>
            <p>ADD SOME INSTRUCTIONS HERE</p>
        </div>
    );
};

function Actions(props: { task: hooks.InProgressTask }) {
    const { task } = props;

    const handleNavigateToTabPage = () => {
        
    };

    return (
        <div>
            <button onChange={handleNavigateToTabPage}>Manage Tab Page</button>
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
                    <Actions task={task}/>
                </>
            </Container>
        );
    }
    return null;
};

export default Popup;
