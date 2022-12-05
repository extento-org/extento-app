import React from 'react';
import Popup from '@app/browser/popup';
import Options from '@app/browser/options';
import render_ui from '@extento/lib/react/render_ui';

const entry = () => {
    render_ui({
        options: <Options />,
        popup: <Popup />,
    });
};

export default entry;
