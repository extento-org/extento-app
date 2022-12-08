import React from 'react';
import Popup from '@_pages/popup';
import Options from '@_pages/options';
import render_pages from '@extento.api/react.render_pages';

import './polyfill.js';

render_pages({
    options: <Options />,
    popup: <Popup />
});
