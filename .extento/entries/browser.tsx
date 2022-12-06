import React from 'react';
import Popup from '@_browser/popup';
import Options from '@_browser/options';
import render_browser from '@extento.api/react.render_browser';

import './polyfill.js';

render_browser({
    options: <Options />,
    popup: <Popup />
});
