import mountOnloadScript from '@extento.api/content.mountOnloadScript';
import mountReactScript from '@extento.api/content.mountReactScript';
import runWorkerProxy from '@extento.api/content.runWorkerProxy';
import runConfigUpdater from '@extento.api/content.runConfigUpdater';

import './polyfill';

runWorkerProxy();
mountOnloadScript();
mountReactScript();
runConfigUpdater();
