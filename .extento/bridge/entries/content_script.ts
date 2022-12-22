// @ts-nocheck

import runWorkerProxy from '@_core/api/content.runWorkerProxy';
import mountReactScript from '@_core/api/content.mountReactScript';
import mountOnloadScript from '@_core/api/content.mountOnloadScript';

import './polyfill';

runWorkerProxy();
mountOnloadScript();
mountReactScript();
