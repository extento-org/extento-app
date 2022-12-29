const constants = require('~/node/constants');

const layerStyles = constants.LAYERS
    .map(layer => ({
        test: new RegExp(`(layers).*(${layer}).*\.(scss|css)$`),
        exclude: /node_modules/,
        use: [
            {
                loader: 'style-loader',
                options: {
                    attributes: { layer, constants: JSON.stringify(constants) },
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

                        const INSERT_LAYER = linkTag.getAttribute('layer');
                        const INSERT_CONSTANTS = JSON.parse(linkTag.getAttribute('constants'));
                        const INSERT_ID_UI = `extento-layer-${INSERT_LAYER}-shadow-ui`;

                        const { SELECTIVE_BUILD, USER_CONFIG } = INSERT_CONSTANTS;

                        const pages = USER_CONFIG.selective_builds[SELECTIVE_BUILD]?.pages;

                        if (pages?.Options === INSERT_LAYER) {
                            appendToShadowRoot(`#app-page-options-extento-shadow-node`, linkTag);
                        }
                        if (pages?.Popup === INSERT_LAYER) {
                            appendToShadowRoot(`#app-page-popup-extento-shadow-node`, linkTag);
                        }
                        if (pages?.Tab === INSERT_LAYER) {
                            appendToShadowRoot(`#app-page-tab-extento-shadow-node`, linkTag);
                        }
                        
                        appendToShadowRoot(`#${INSERT_ID_UI}`, linkTag);
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
                        config: constants.PATH_APP_POSTCSS,
                    },
                },
            }
            
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

                        const INSERT_CLASSNAME = `extento-shadow-dom`;

                        appendToShadowRoot(`.${INSERT_CLASSNAME}`, linkTag);
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
                        config: constants.PATH_APP_POSTCSS,
                    },
                },
            }
            
        ],
    },
]

const styleRules = [
    ...layerStyles,
    ...sharedStyles
];

module.exports = styleRules;