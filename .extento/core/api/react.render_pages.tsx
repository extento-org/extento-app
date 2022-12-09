import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalContext from '@_core/react.context_global';

const shared_css = require('@_styles/global.css');
const pages_css = require('@_pages/styles/index.css');
const shared_scss = require('@_styles/global.scss');
const pages_scss = require('@_pages/styles/index.scss');

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = (props: { Tab?: React.FunctionComponent, Options?: React.FunctionComponent, Popup?: React.FunctionComponent }) => {
    const params = React.useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search],
    );

    if (
        typeof props.Options !== 'undefined' 
            && params.get('options') === 'true'
    ) {
        return <props.Options />;
    }

    if (
        typeof props.Tab !== 'undefined' 
            && params.get('tab') === 'true'
    ) {
        return <props.Tab />;
    }

    if (
        typeof props.Popup !== 'undefined' 
            && params.get('popup') === 'true'
    ) {
        return <props.Popup />;
    }

    return <div />;
};

const render_pages = (opts: {
    Popup?: React.FunctionComponent,
    Options?: React.FunctionComponent,
    Tab?: React.FunctionComponent,
}) => {
    const style_tag = document.createElement('style');
    document.head.appendChild(style_tag);
    style_tag.textContent = shared_css + '\n\n' + shared_scss + '\n\n' + pages_css + '\n\n' + pages_scss;

    root.render(
        <React.StrictMode>
            <GlobalContext>
                <App Popup={opts.Popup} Tab={opts.Tab} Options={opts.Options}/>
            </GlobalContext>
        </React.StrictMode>,
    )
};

export default render_pages;