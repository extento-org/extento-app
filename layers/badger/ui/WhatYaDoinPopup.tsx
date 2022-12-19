import React from 'react';
import * as hooks from '@app.shared/hooks';
import worker from '@extento.browser/worker'

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className='fixed flex flex-col items-center justify-center w-full h-full'>
            {children}
        </div>
    );
};

function ObnoxiousWarning() {
    const handleNavigateToTabPage = async () => {
        await worker.badger.newTab();
    };

    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white">
            <button onClick={() => handleNavigateToTabPage()} className="btn btn-secondary">GET BACK TO WORK</button>
        </div>
    );
};

const Popup = () => {
    const { 
        isLoading: isLoadingBlacklisted,
        blacklisted,
    } = hooks.useBlacklistedQuery(window.location.href);
    const siteIsBlacklisted = !isLoadingBlacklisted && blacklisted;
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    const showTask = siteIsBlacklisted && !isLoadingTask && !!task;

    if (showTask) {
        return(
            <ObnoxiousWarning />
        );
    }
    
    return null;
};

export default Popup;
