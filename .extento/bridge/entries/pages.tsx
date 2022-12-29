// @ts-nocheck

import pages from '@_compiled/bridge/pages';
import renderPages from '@_core/api/react.renderPages';

import './polyfill';

const untypedPages: any = pages;

renderPages(untypedPages);
