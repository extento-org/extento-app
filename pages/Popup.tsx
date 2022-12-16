import React from 'react';

// TODO: Popup.useWorkModeToggle
const useWorkModeToggle = () => {
    
};

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
        <Container>
            <ToggleWorkMode />
        </Container>
    );
};
