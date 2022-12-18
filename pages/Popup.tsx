import React from 'react';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';

// TODO: Popup.Container
function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
};

// TODO: Popup.ToggleWorkMode
function ToggleWorkMode() {
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
