import React from 'react';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import Countdown from './Countdown';
import WhatYaDoinPopup from './WhatYaDoinPopup';

function Uis() {
    return(
        <ReactQueryProvider>
            <>
                <Countdown />
                <WhatYaDoinPopup />
            </>
        </ReactQueryProvider>
    );
}

export default [
    Uis,
];
