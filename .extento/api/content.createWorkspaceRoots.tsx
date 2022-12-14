import styles from '@_codegen/webpack.styles';
import createWorkspaceRoots from '@_core/api/content.createWorkspaceRoots';
import workspaceContexts from '@extento.api/react.workspaceContexts';

export default function(): void { createWorkspaceRoots(workspaceContexts, styles); };