import React from 'react';
import renderShadowRoot from '@_core/ui/renderShadowRoot';
import constants from '@ex.compiled/constants';

function AppPage(props: {
    FunctionComponent: React.FunctionComponent,
    param: 'popup' | 'options' | 'tab',
}) {
    const { param, FunctionComponent } = props;

    const params = React.useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search],
    );

    if (
        typeof FunctionComponent !== 'undefined'
            && params.get(param) === 'true'
    ) {
        return <FunctionComponent />;
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
            reset_page: true,
            id: constants.SELECTORS_PAGES.tab,
            class: constants.SELECTOR_DOM_CLASSNAME,
            children: (
                <React.StrictMode>
                    <AppPage param="tab" FunctionComponent={opts.Tab} />
                </React.StrictMode>
            ),
        });
    }

    if (opts.Options) {
        renderShadowRoot({
            reset_page: true,
            id: constants.SELECTORS_PAGES.options,
            class: constants.SELECTOR_DOM_CLASSNAME,
            children: (
                <React.StrictMode>
                    <AppPage param="options" FunctionComponent={opts.Options} />
                </React.StrictMode>
            ),
        });
    }

    if (opts.Popup) {
        renderShadowRoot({
            reset_page: true,
            id: constants.SELECTORS_PAGES.popup,
            class: constants.SELECTOR_DOM_CLASSNAME,
            children: (
                <React.StrictMode>
                    <AppPage param="popup" FunctionComponent={opts.Popup} />
                </React.StrictMode>
            ),
        });
    }
};

export default renderPages;
