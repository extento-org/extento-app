import React from 'react';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className='fixed top-0 left-0 px-3 py-2 rounded-md bg-slate-500'>
            {children}
        </div>
    );
};

function Timer() {
    const countdown = hooks.useCountdownQuery();
    return (
        <p className="text-white">
            {countdown}
        </p>
    );
};

const Countdown = () => {
    return(
        <Container>
            <Timer />
        </Container>
    );
};

export default Countdown;