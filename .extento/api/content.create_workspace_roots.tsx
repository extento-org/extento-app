// @ts-nocheck

import styles from '@_codegen/webpack.styles';
import uis from '@_codegen/webpack.uis';
import create_workspace_roots from '@_core/api/content.create_workspace_roots';

export default function(): void { create_workspace_roots(uis, styles); };