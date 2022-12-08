import React from 'react';

const WorkspaceUiOverlay = (props: { children: JSX.Element, offset: number }) => {
    return (
        <div 
            style={{ 
                zIndex: 2147483647 - props.offset, 
                position: 'relative', 
                width: 'inherit', height: 'inherit', 
                display: 'flex',
            }}>
            {props.children}
        </div>
    );
};

export default WorkspaceUiOverlay;