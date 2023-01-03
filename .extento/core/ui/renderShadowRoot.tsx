import React from 'react';
import ReactDOM from 'react-dom';

export type ShadowRootProps = {
    reset_page?: boolean,
    children: JSX.Element,
    id: any,
    class: any,
    shadow_options?: ShadowRootInit,
};

const renderShadowRoot = (props: ShadowRootProps) => {
    // setup the container to place the shadow root in
    const shadowOptions: ShadowRootInit = {
        mode: 'open',
        ...(props.shadow_options || {}),
    };

    // remove default padding/margin
    const resetCss = props.reset_page
        ? '<style>html, body { margin: 0px; padding: 0px; }</style>'
        : '';
    if (resetCss) {
        document.head.innerHTML += resetCss;
    }

    const shadowContainer = document.createElement('div');
    shadowContainer.setAttribute('id', props.id);
    shadowContainer.className = `${shadowContainer.className} ${props.class}`;
    const reactRootId = `${props.id}-react-root`;

    // attach a shadow root to it
    shadowContainer.attachShadow(shadowOptions)
        .innerHTML = `<div id='${reactRootId}' />`;
    const { shadowRoot } = shadowContainer;

    // attach it to the page!
    document.body.append(shadowContainer);

    ReactDOM.render(
        <React.StrictMode>
            {props.children}
        </React.StrictMode>,
        shadowRoot.querySelector(`#${reactRootId}`),
    );
};

export default renderShadowRoot;
