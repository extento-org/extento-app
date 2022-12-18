// @ts-nocheck

import workerApis from '@_codegen/webpack.workerApis';
import defineListener from '@_core/api/worker.defineListener';

export default function(): void { defineListener(workerApis); };