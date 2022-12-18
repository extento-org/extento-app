import React from 'react';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
};

function ToggleWorkMode() {
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    if (isLoadingTask) {
        return null;
    }
    if (!!task) {
        const isWorkMode = task.mode === 'WORK';
        return (
            <div>
                
            </div>
        );
    }
    return (
        <div>
            
        </div>
    );
};

export default function Popup() {
    return (
        <ReactQueryProvider>
            <Container>
                <ToggleWorkMode />
            </Container>
        </ReactQueryProvider>
    );
};
