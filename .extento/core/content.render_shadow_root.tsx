import React from 'react';
import ReactDOM from 'react-dom/client';

export type ShadowRootProps = { 
    children: JSX.Element, 
    id: string, 
    css?: string, 
    shadow_options?: ShadowRootInit 
};

const render_shadow_root = (props: ShadowRootProps) => {
    // setup the container to place the shadow root in
    const shadow_options: ShadowRootInit = {
        mode: 'open',
        ...(props.shadow_options || {})
    };
    const shadow_container = document.createElement('div');
    shadow_container.setAttribute('id', props.id);

    // attach a shadow root to it
    const shadow_root = shadow_container.attachShadow(shadow_options);

    // optionally apply styles if provided
    if (typeof props.css === 'string') {
        const style_tag = document.createElement('style');
        style_tag.innerHTML = props.css;
        shadow_root.appendChild(style_tag);
    }

    // create a react root with the new shadow root
    const root = ReactDOM.createRoot(shadow_root);

    // attach it to the page!
    document.body.prepend(shadow_container);

    root.render(
        <React.StrictMode>
            {props.children}
        </React.StrictMode>,
    );
};

export default render_shadow_root;