import React from 'react';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className='fixed z-50 p-4 m-4 rounded-md bottom-1 left-1 bg-slate-500 opacity-60'>
            {children}
        </div>
    );
};

function Timer() {
    const countdown = hooks.useCountdownQuery();
    return (
        <p className="leading-none text-white">
            {countdown}
        </p>
    );
};

const Countdown = () => {
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    const show = !isLoadingTask && !!task;
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