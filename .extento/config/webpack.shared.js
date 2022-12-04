const fs = require('fs');
const webpack_merge = require('webpack-merge');
const terser_webpack_plugin = require('terser-webpack-plugin');
const html_webpack_plugin = require('html-webpack-plugin');
const tsconfig_paths_webpack_plugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const { ONLOAD_ENTRY_PATH, BACKGROUND_ENTRY_PATH, CONTENT_SCRIPT_ENTRY_PATH, WORKSPACES_CODEGEN_PATH, WORKSPACES_PATH, BROWSER_INDEX_HTML_PATH, BROWSER_ENTRY_PATH, UI_ENTRY_PATH, TSCONFIG_PATH, DIST_ONLOAD, DIST_BACKGROUND, DIST_CONTENT_SCRIPT, DIST_BROWSER_JS, DIST_BROWSER_HTML, DIST_UI, CHROME_EXTENSION_PATH, POSTCSS_CONFIG, } = require('./constants.js');
const scripts_plugin = require('./scripts');
if (!fs.readdirSync(WORKSPACES_PATH).length) {
    throw new Error(`You must first create a workspace using the cli!`);
}
process.env.EXTENTO_SELECTIVE_BUILD = (process.env.SELECTIVE_BUILD || 'MASTER').toUpperCase();
const build_webpack_common_config = (common, mode) => webpack_merge.merge({
    mode: mode,
    ...(mode === 'development' ? {
        devtool: 'inline-source-map'
    } : {}),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        plugins: [new tsconfig_paths_webpack_plugin()]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: POSTCSS_CONFIG,
                            },
                        },
                    }
                ],
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                    {
                        loader: "markdown-loader"
                    },
                ],
            },
            { test: /\.json$/, type: 'json' },
            {
                test: /\.([cm]?ts|tsx)$/,
                use: [{
                        loader: 'ts-loader',
                        options: {
                            configFile: TSCONFIG_PATH,
                            projectReferences: true
                        }
                    }],
            },
        ]
    },
    optimization: {
        minimizer: [new terser_webpack_plugin({
                extractComments: false,
            })],
    },
    ...(mode === 'development' ? {
        node: {
            global: false
        }
    } : {}),
    plugins: [
        new webpack.WatchIgnorePlugin({
            paths: [
                WORKSPACES_CODEGEN_PATH
            ]
        }),
        new webpack.DefinePlugin({
            EXTENTO_SELECTIVE_BUILD: process.env.EXTENTO_SELECTIVE_BUILD,
        }),
        ...(mode === 'development' ? [
            new webpack.DefinePlugin({
                global: 'window' // Placeholder for global used in any node_modules
            })
        ] : []),
        scripts_plugin
    ]
}, common);
const add_dev_server_ports = (webpack_configs) => webpack_configs.map((webpack_config, i) => webpack_merge.merge(webpack_config, {
    devServer: {
        port: 42001 + i
    }
}));
const build_webpack_configs = (common, mode) => {
    const webpack_common_config = build_webpack_common_config(common, mode);
    return add_dev_server_ports([
        webpack_merge.merge(webpack_common_config, {
            entry: ONLOAD_ENTRY_PATH,
            output: {
                filename: DIST_ONLOAD
            }
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: BACKGROUND_ENTRY_PATH,
            output: {
                filename: DIST_BACKGROUND
            }
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: CONTENT_SCRIPT_ENTRY_PATH,
            output: {
                filename: DIST_CONTENT_SCRIPT
            }
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: BROWSER_ENTRY_PATH,
            output: {
                filename: DIST_BROWSER_JS
            },
            plugins: [
                new html_webpack_plugin({
                    template: BROWSER_INDEX_HTML_PATH,
                    filename: DIST_BROWSER_HTML
                })
            ]
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: UI_ENTRY_PATH,
            output: {
                filename: DIST_UI
            }
        })
    ]);
};
module.exports = (mode) => build_webpack_configs({
    output: {
        path: CHROME_EXTENSION_PATH
    },
}, mode);
