import mountOnloadScript from '@extento.internal-api/content.mountOnloadScript';
import mountReactScript from '@extento.internal-api/content.mountReactScript';
import runWorkerProxy from '@extento.internal-api/content.runWorkerProxy';

import './polyfill';

runWorkerProxy();
mountOnloadScript();
mountReactScript();
