// @ts-nocheck

import styles from '@_codegen/webpack.styles';
import createLayerRoots from '@_core/api/content.createLayerRoots';
import states from '@extento.react/states';

export default function(): void { createLayerRoots(states, styles); };