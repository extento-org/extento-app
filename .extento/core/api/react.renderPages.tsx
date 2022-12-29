import React from 'react';
import GlobalContext from '@_core/react.contextGlobal';
import renderShadowRoot from '@_core/content.renderShadowRoot';
import constants from '@_core/constants';

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

function TabPage(props: {
    Tab: React.FunctionComponent,
}) {
    const { Tab } = props;

    const params = React.useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search],
    );

    if (
        typeof Tab !== 'undefined'
            && params.get('tab') === 'true'
    ) {
        return <Tab />;
    }

    return <div />;
}

function OptionsPage(props: {
    Options: React.FunctionComponent,
}) {
    const { Options } = props;

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

    return <div />;
}

function PopupPage(props: {
    Popup: React.FunctionComponent,
}) {
    const { Popup } = props;

    const params = React.useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search],
    );

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
    Popup?: React.FunctionComponent,
    Options?: React.FunctionComponent,
    Tab?: React.FunctionComponent,
}) => {
    if (opts.Tab) {
        renderShadowRoot({
            id: `app-page-tab-${constants.DOM_ID_SHADOW_ROOT}`,
            class: constants.DOM_ID_SHADOW_ROOT,
            children: (
                <React.StrictMode>
                    <GlobalContext>
                        <TabPage Tab={opts.Tab} />
                    </GlobalContext>
                </React.StrictMode>
            ),
        });
    }

    if (opts.Options) {
        renderShadowRoot({
            id: `app-page-options-${constants.DOM_ID_SHADOW_ROOT}`,
            class: constants.DOM_ID_SHADOW_ROOT,
            children: (
                <React.StrictMode>
                    <GlobalContext>
                        <OptionsPage Options={opts.Options} />
                    </GlobalContext>
                </React.StrictMode>
            ),
        });
    }

    if (opts.Popup) {
        renderShadowRoot({
            id: `app-page-popup-${constants.DOM_ID_SHADOW_ROOT}`,
            class: constants.DOM_ID_SHADOW_ROOT,
            children: (
                <React.StrictMode>
                    <GlobalContext>
                        <PopupPage Popup={opts.Popup} />
                    </GlobalContext>
                </React.StrictMode>
            ),
        });
    }
};

export default renderPages;
