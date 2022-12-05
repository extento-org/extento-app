import React from 'react';
import Popup from '@app/popup';
import Options from '@app/options';
import render_ui from '@exento/lib/react/render_ui';

const entry = () => {
    render_ui({
        options: <Options />,
        popup: <Popup />,
    });
};

export default entry;
