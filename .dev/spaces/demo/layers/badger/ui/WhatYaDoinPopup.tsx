import React from 'react';
import * as hooks from '@app.shared/hooks';
import worker from '@ex.browser/worker'

function ObnoxiousWarning() {
    /* -------------------------------- HANDLERS -------------------------------- */
    const handleNavigateToTabPage = async () => {
        await worker.badger.newTab();
    };

    /* --------------------------------- RENDER --------------------------------- */
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white">
            <button onClick={() => handleNavigateToTabPage()} className="btn btn-secondary">GET BACK TO WORK</button>
        </div>
    );
};

const Popup = () => {
    /* ------------------------------ REACT QUERIES ----------------------------- */
    const { 
        isLoading: isLoadingBlacklisted,
        blacklisted,
    } = hooks.useBlacklistedQuery(window.location.href);
    const { isLoading: isLoadingTask, task } = hooks.useTask();

    /* --------------------------------- HELPERS -------------------------------- */
    const siteIsBlacklisted = !isLoadingBlacklisted && blacklisted;
    const showOverlay = siteIsBlacklisted 
        && !isLoadingTask 
        && !!task
        && task.mode === 'WORK';

    /* --------------------------------- RENDER --------------------------------- */
    if (showOverlay) {
        return(
            <ObnoxiousWarning />
        );
    }
    
    return null;
};

export default Popup;
