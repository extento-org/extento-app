import React from 'react';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className='fixed p-2 m-2 rounded-md bottom-1 left-1 bg-slate-500 opacity-60'>
            {children}
        </div>
    );
};

function Timer() {
    /* ------------------------------ REACT QUERIES ----------------------------- */
    const countdown = hooks.useCountdownQuery();

    /* --------------------------------- RENDER --------------------------------- */
    return (
        <p className="leading-none text-white">
            {countdown}
        </p>
    );
};

const Countdown = () => {
    /* ------------------------------ REACT QUERIES ----------------------------- */
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    
    const show = !isLoadingTask && !!task;

    /* --------------------------------- RENDER --------------------------------- */
    if (!show) {
        return null;
    }
    return(
        <Container>
            <Timer />
        </Container>
    );
};

export default Countdown;