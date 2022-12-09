import pages from '@_pages';
import render_pages from '@extento.api/react.render_pages';

import './polyfill.js';

const untyped_pages: any = pages;
render_pages(untyped_pages);
