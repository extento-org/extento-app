import React from 'react';
import states from '@extento.react/states';

// TODO: ui.Container
function Container(props: { children: React.ReactElement }) {
    const { children } = props;

    return (
        <div>
            {children}
        </div>
    );
};

// TODO: ui.CurrentTask
function CurrentTask() {
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

// TODO: ui.Actions
function Actions() {
    return (
        <div>
            
        </div>
    );
};

// TODO: ui.Popup
const Popup = () => {
    return(
        <Container>
            <>
                <CurrentTask />
                <Instructions />
                <Actions />
            </>
        </Container>
    );
};

export default Popup;
