// @ts-nocheck

import workers from '@_codegen/webpack.workers';
import workerApis from '@_codegen/webpack.workerApis';
import defineWorkers from '@_core/api/worker.defineWorkers';
import defineListener from '@_core/api/worker.defineListener';

defineListener(workerApis);
defineWorkers(workers);
