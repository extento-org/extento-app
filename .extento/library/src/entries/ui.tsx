import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalContext, { EnabledUIs } from '@exento/lib/react/GlobalContext';
import constants from '@exento/lib/constants';

const entry = () => {
    const container = document.createElement('div');
    container.setAttribute('id', constants.DOM_ID_UI_MOUNT);

    document.body.prepend(container);

    const root = ReactDOM.createRoot(container);

    root.render(
        <React.StrictMode>
            <GlobalContext>
                <EnabledUIs />
            </GlobalContext>
        </React.StrictMode>,
    );
};

export default entry;
