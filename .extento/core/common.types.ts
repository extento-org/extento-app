import React from 'react';
import { WorkspaceName } from '@extento.types';

export type CodegenStylesheets = { [key in WorkspaceName]: { css: string, scss: string } };
export type CodegenUis = { [key in WorkspaceName]: { default: React.FunctionComponent<any> } };
export type CodegenOnloads = { [key in WorkspaceName]: { default: Function } };
export type Publisher = { [key in WorkspaceName]: Function };
export type Subscriber = { [key in WorkspaceName]: Function };