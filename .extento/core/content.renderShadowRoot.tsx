import React from 'react';
import ReactDOM from 'react-dom';

export type ShadowRootProps = {
    children: JSX.Element,
    id: string,
    css?: string,
    shadow_options?: ShadowRootInit,
};

const renderShadowRoot = (props: ShadowRootProps) => {
    // setup the container to place the shadow root in
    const shadowOptions: ShadowRootInit = {
        mode: 'open',
        ...(props.shadow_options || {}),
    };
    const shadowContainer = document.createElement('div');
    shadowContainer.setAttribute('id', props.id);
    const reactRootId = `${props.id}-react-root`;

    // attach a shadow root to it
    shadowContainer.attachShadow(shadowOptions)
        .innerHTML = `
            <style>${props.css || ''}</style>
            <div id='${reactRootId}' />
        `;
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
