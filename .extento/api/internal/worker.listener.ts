// @ts-nocheck

import workers from '@_codegen/webpack.workers';
import defineListener from '@_core/api/worker.defineListener';

export default function(): void { defineListener<typeof workers>(workers); };