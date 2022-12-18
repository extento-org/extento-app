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

function Timer() {
    const countdown = hooks.useCountdownQuery();
    return (
        <div>
            {countdown}
        </div>
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