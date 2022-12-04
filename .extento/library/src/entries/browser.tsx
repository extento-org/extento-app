import React from 'react';
import Popup from '@browser/popup';
import Options from '@browser/options';
import render_ui from '@extento/react/render_ui';

const entry = () => {
    render_ui({
        options: <Options />,
        popup: <Popup />,
    });
};

export default entry;
