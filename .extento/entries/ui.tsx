import React from 'react';
import ReactDOM from 'react-dom/client';
import uis from '@_codegen/webpack.uis';
import GlobalContext, { EnabledUIs } from '@_package/react/GlobalContext';
import constants from '@_package/constants';

const entry = () => {
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

entry();