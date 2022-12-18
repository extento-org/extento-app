import React from 'react';
import * as hooks from '@app.shared/hooks';

// TODO: ui.Container
function Container(props: { children: React.ReactElement }) {
    const { children } = props;

    return (
        <div>
            {children}
        </div>
    );
};

// TODO: ui.Timer
function Timer() {
    return (
        <div>
            
        </div>
    );
};

// TODO: ui.Countdown
const Countdown = () => {
    return(
        <Container>
            <Timer />
        </Container>
    );
};

export default Countdown;