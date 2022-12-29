// @ts-nocheck

import workers from '@_compiled/bridge/workers';
import workerApis from '@_compiled/bridge/workerApis';
import defineWorkers from '@_core/api/worker.defineWorkers';
import defineListener from '@_core/api/worker.defineListener';

defineListener(workerApis);
defineWorkers(workers);
