import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalContext from '@_core/react.context_global';

const shared_css = require('@_styles/shared.css');
const pages_css = require('@_styles/pages.css');
const shared_scss = require('@_styles/shared.scss');
const pages_scss = require('@_styles/pages.scss');

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

const render_pages = (opts: {
    popup: React.ReactElement,
    options: React.ReactElement,
}) => {
    const style_tag = document.createElement('style');
    document.head.appendChild(style_tag);
    style_tag.textContent = shared_css + '\n\n' + shared_scss + '\n\n' + pages_css + '\n\n' + pages_scss;

    root.render(
        <React.StrictMode>
            <GlobalContext>
                <App popup={opts.popup} options={opts.options}/>
            </GlobalContext>
        </React.StrictMode>,
    )
};

export default render_pages;