import mountOnloadScript from '@extento.api/content.mountOnloadScript';
import mountReactScript from '@extento.api/content.mountReactScript';
import runWorkerProxy from '@extento.api/content.runWorkerProxy';

import './polyfill';

runWorkerProxy();
mountOnloadScript();
mountReactScript();
