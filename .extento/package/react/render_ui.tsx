import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalContext from '@_package/react/GlobalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = (props: { options: React.ReactElement, popup: React.ReactElement }) => {
    const params = React.useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search],
    );

    if (params.get('options') === 'true') {
        return props.options;
    }

    if (params.get('popup') === 'true') {
        return props.popup;
    }

    return <div />;
};

const render_ui = (opts: {
    popup: React.ReactElement,
    options: React.ReactElement,
}) => root.render(
    <React.StrictMode>
        <GlobalContext>
            <App popup={opts.popup} options={opts.options}/>
        </GlobalContext>
    </React.StrictMode>,
);

export default render_ui;