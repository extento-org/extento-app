// @ts-nocheck

import backgroundApis from '@_codegen/webpack.backgroundApis';
import defineListener from '@_core/api/worker.defineListener';

export default function(): void { defineListener<typeof backgroundApis>(backgroundApis); };