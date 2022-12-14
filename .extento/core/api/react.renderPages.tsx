import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalContext from '@_core/react.contextGlobal';

const sharedCss = require('@_styles/global.css');
const pagesCss = require('@_pages/styles/index.css');
const sharedScss = require('@_styles/global.scss');
const pagesScss = require('@_pages/styles/index.scss');

const root = ReactDOM.createRoot(document.getElementById('root'));

function App(props: {
    Tab?: React.FunctionComponent,
    Options?: React.FunctionComponent,
    Popup?: React.FunctionComponent,
}) {
    const { Tab, Options, Popup } = props;

    const params = React.useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search],
    );

    if (
        typeof Options !== 'undefined'
            && params.get('options') === 'true'
    ) {
        return <Options />;
    }

    if (
        typeof Tab !== 'undefined'
            && params.get('tab') === 'true'
    ) {
        return <Tab />;
    }

    if (
        typeof Popup !== 'undefined'
            && params.get('popup') === 'true'
    ) {
        return <Popup />;
    }

    return <div />;
}

App.defaultProps = {
    Options: null,
    Popup: null,
    Tab: null,
};

const renderPages = (opts: {
    Popup: React.FunctionComponent,
    Options: React.FunctionComponent,
    Tab: React.FunctionComponent,
}) => {
    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
    styleTag.textContent = `${sharedCss}\n\n${sharedScss}\n\n${pagesCss}\n\n${pagesScss}`;

    root.render(
        <React.StrictMode>
            <GlobalContext>
                <App Popup={opts.Popup} Tab={opts.Tab} Options={opts.Options} />
            </GlobalContext>
        </React.StrictMode>,
    );
};

export default renderPages;
