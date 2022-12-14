// @ts-nocheck

import onloads from '@_codegen/webpack.onloads';
import defineOnloads from '@_core/api/window.defineOnloads';

export default function(): void { defineOnloads(onloads); };