import pages from '@_pages';
import renderPages from '@extento.api/react.renderPages';

import './polyfill';

const untypedPages: any = pages;

renderPages(untypedPages);
