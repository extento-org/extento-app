import React from 'react';
import Popup from '@app/browser/Popup';
import Options from '@app/browser/Options';
import render_ui from '@extento/react/render_ui';

const entry = () => {
    render_ui({
        options: <Options />,
        popup: <Popup />,
    });
};

export default entry;
