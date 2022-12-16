import React from 'react';

// TODO: Tab.Container
function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
};

// TODO: Tab.Controls
function Controls() {
    return (
        <div>
            
        </div>
    );
};

// TODO: Tab.ActiveTask
function ActiveTask() {
    return (
        <div>
            
        </div>
    );
};

// TODO:
function History() {
    return (
        <div>
            
        </div>
    );
};

export default function Tab() {
    return (
        <Container>
            <>
                <Controls />
                <ActiveTask />
                <History />
            </>
        </Container>
    );
};
