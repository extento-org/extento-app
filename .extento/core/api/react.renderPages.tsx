import React from 'react';
import GlobalContext from '@_core/react.contextGlobal';
import renderShadowRoot from '@_core/content.renderShadowRoot';
import constants from '@ex.compiled/constants';

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

const renderPages = (opts: {
    Popup?: React.FunctionComponent,
    Options?: React.FunctionComponent,
    Tab?: React.FunctionComponent,
}) => {
    if (opts.Tab) {
        renderShadowRoot({
            id: constants.SELECTORS_PAGES.tab,
            class: constants.SELECTOR_DOM_CLASSNAME,
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
            id: constants.SELECTORS_PAGES.options,
            class: constants.SELECTOR_DOM_CLASSNAME,
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
            id: constants.SELECTORS_PAGES.popup,
            class: constants.SELECTOR_DOM_CLASSNAME,
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
