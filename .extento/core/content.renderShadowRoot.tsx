import React from 'react';
import ReactDOM from 'react-dom/client';

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

    // attach a shadow root to it
    const shadowRoot = shadowContainer.attachShadow(shadowOptions);

    // optionally apply styles if provided
    if (typeof props.css === 'string') {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = props.css;
        shadowRoot.appendChild(styleTag);
    }

    // create a react root with the new shadow root
    const root = ReactDOM.createRoot(shadowRoot);

    // attach it to the page!
    document.body.prepend(shadowContainer);

    root.render(
        <React.StrictMode>
            {props.children}
        </React.StrictMode>,
    );
};

export default renderShadowRoot;
