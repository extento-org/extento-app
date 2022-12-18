import React from 'react';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';

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

// TODO: Tab.TaskForm
function TaskForm() {
    return (
        <div>
            
        </div>
    );
};

// TODO: Tab.BlacklistForm
function BlacklistForm() {
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

// TODO: Tab.History
function History() {
    return (
        <div>
            
        </div>
    );
};

export default function Tab() {
    return (
        <ReactQueryProvider>
            <Container>
                <>
                    <Controls />
                    <TaskForm />
                    <BlacklistForm />
                    <ActiveTask />
                    <History />
                </>
            </Container>
        </ReactQueryProvider>
    );
};
