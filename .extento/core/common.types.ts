import React from 'react';
import { LayerName } from '@ex.compiled';

export type CodegenStyles = { [key in LayerName]: { css: string, scss: string } };
export type CodegenUis = { [key in LayerName]: { default: React.FunctionComponent<any> } };
export type CodegenState = { [key in LayerName]: { default: { initial: any } } };
export type CodegenOnloads = { [key in LayerName]: { default: Function } };
export type Publisher = { [key in LayerName]: Function };
export type Subscriber = { [key in LayerName]: Function };
