// @ts-nocheck

import workers from '@_codegen/webpack.workers';
import defineWorkers from '@_core/api/worker.defineWorkers';

export default function(): void { defineWorkers(workers); };