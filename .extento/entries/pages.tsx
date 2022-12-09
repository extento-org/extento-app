import pages from '@_pages';
import render_pages from '@extento.api/react.render_pages';

import './polyfill.js';

render_pages({
    Options: pages.Options,
    Tab: pages.Tab,
    Popup: pages.Popup
});
