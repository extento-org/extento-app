import React from 'react';

function WorkspaceUiOverlay(props: { children: JSX.Element, offset: number }) {
    const { offset, children } = props;
    return (
        <div
            style={{
                zIndex: 2147483647 - offset,
                position: 'relative',
                width: 'inherit',
                height: 'inherit',
                display: 'flex',
            }}
        >
            {children}
        </div>
    );
}

export default WorkspaceUiOverlay;
