import React from 'react';
import ReactDOM from 'react-dom/client';
import { CodegenUis } from '@_core/common.types';
import GlobalContext, { EnabledUIs } from '@_core/react.context_global';
import constants from '@_core/constants';

export default (uis: CodegenUis) => {
    const container = document.createElement('div');
    container.setAttribute('id', constants.DOM_ID_UI_MOUNT);

    document.body.prepend(container);

    const root = ReactDOM.createRoot(container);

    root.render(
        <React.StrictMode>
            <GlobalContext>
                <EnabledUIs uis={uis} />
            </GlobalContext>
        </React.StrictMode>,
    );
};