import React from 'react';
import Example from './Example';
import { Provider } from './context';

const UI = (props: any) => (
    <Provider components={[
        <Example {...props} key={'Example'} />,
    ]} />
);

export default UI;
