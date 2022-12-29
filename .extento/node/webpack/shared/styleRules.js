const _constants = require('~/node/constants');

const layerStyles = _constants.LAYERS
    .map(injectLayer => ({
        test: new RegExp(`(layers).*(${injectLayer}).*\.(scss|css)$`),
        exclude: /node_modules/,
        use: [
            {
                loader: 'style-loader',
                options: {
                    attributes: { layer: injectLayer, constants: JSON.stringify(_constants) },
                    insert: function (linkTag) {
                        const appendToShadowRoot = (selector, child) => {
                            const append = (element) => {
                                if (typeof element.shadowRoot === 'undefined') {
                                    return;
                                }
                                element.shadowRoot.appendChild(child);
                            };
                        
                            if (document.querySelector(selector)) {
                                append(document.querySelector(selector));
                                return;
                            }
                        
                            const observer = new MutationObserver(() => {
                                if (document.querySelector(selector)) {
                                    append(document.querySelector(selector));
                                    observer.disconnect();
                                }
                            });
                        
                            observer.observe(document.body, {
                                childList: true,
                                subtree: true
                            });
                        };

                        const layer = linkTag.getAttribute('layer');
                        const constants = JSON.parse(linkTag.getAttribute('constants'));
                        const { SELECTIVE_BUILD, USER_CONFIG } = constants;

                        const layer_shadow_dom_id = constants.SELECTORS_LAYERS[layer].shadow_ui;
                        const pages = USER_CONFIG.selective_builds[SELECTIVE_BUILD]?.pages;

                        if (pages?.Options === layer) {
                            appendToShadowRoot(`#${constants.SELECTORS_PAGES.options}`, linkTag);
                        }
                        if (pages?.Popup === layer) {
                            appendToShadowRoot(`#${constants.SELECTORS_PAGES.popup}`, linkTag);
                        }
                        if (pages?.Tab === layer) {
                            appendToShadowRoot(`#${constants.SELECTORS_PAGES.tab}`, linkTag);
                        }
                        
                        appendToShadowRoot(`#${layer_shadow_dom_id}`, linkTag);
                    },
                },
            },
            {
                loader: 'css-loader',
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        config: _constants.PATH_APP_POSTCSS,
                    },
                },
            },
        ],
    }));

const sharedStyles = [
    {
        test: new RegExp(`(shared).*\.(scss|css)$`),
        exclude: /node_modules/,
        use: [
            {
                loader: 'style-loader',
                options: {
                    attributes: { constants: JSON.stringify(_constants) },
                    insert: function (linkTag) {
                        const appendToShadowRoot = (selector, child) => {
                            const append = (element) => {
                                if (typeof element.shadowRoot === 'undefined') {
                                    return;
                                }
                                element.shadowRoot.appendChild(child);
                            };
                        
                            if (document.querySelector(selector)) {
                                append(document.querySelector(selector));
                                return;
                            }
                        
                            const observer = new MutationObserver(() => {
                                if (document.querySelector(selector)) {
                                    append(document.querySelector(selector));
                                    observer.disconnect();
                                }
                            });
                        
                            observer.observe(document.body, {
                                childList: true,
                                subtree: true
                            });
                        };

                        const constants = JSON.parse(linkTag.getAttribute('constants'));
                        appendToShadowRoot(`.${constants.SELECTOR_DOM_CLASSNAME}`, linkTag);
                    },
                },
            },
            {
                loader: 'css-loader',
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        config: _constants.PATH_APP_POSTCSS,
                    },
                },
            },
        ],
    },
]

const styleRules = [
    ...layerStyles,
    ...sharedStyles,
];

module.exports = styleRules;