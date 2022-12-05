const fs = require('fs');
const webpack_merge = require('webpack-merge');
const terser_webpack_plugin = require('terser-webpack-plugin');
const html_webpack_plugin = require('html-webpack-plugin');
const tsconfig_paths_webpack_plugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

const { 
    PATH_APP_WEBPACK,
    PATH_INTERNAL_ENTRIES_ONLOAD, 
    PATH_INTERNAL_ENTRIES_BACKGROUND, 
    PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT, 
    PATH_INTERNAL_CODEGEN, 
    PATH_APP_WORKSPACES, 
    PATH_INTERNAL_ENTRIES_BROWSER_HTML, 
    PATH_INTERNAL_ENTRIES_BROWSER, 
    PATH_INTERNAL_ENTRIES_UI, 
    PATH_MASTER_TSCONFIG, 
    DIST_ONLOAD, 
    DIST_BACKGROUND, 
    DIST_CONTENT_SCRIPT, 
    DIST_BROWSER_JS, 
    DIST_BROWSER_HTML, 
    DIST_UI, 
    PATH_APP_EXTENSION, 
    PATH_MASTER_POSTCSS, 
} = require('./constants.js');

const scripts_plugin = require('./scripts');

if (!fs.readdirSync(PATH_APP_WORKSPACES).length) {
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
                                config: PATH_MASTER_POSTCSS,
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
                test: /\.tsx$/,
                use: [{
                        loader: 'ts-loader',
                        options: {
                            configFile: PATH_MASTER_TSCONFIG
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
                PATH_INTERNAL_CODEGEN
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
            entry: PATH_INTERNAL_ENTRIES_ONLOAD,
            output: {
                filename: DIST_ONLOAD
            }
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: PATH_INTERNAL_ENTRIES_BACKGROUND,
            output: {
                filename: DIST_BACKGROUND
            }
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT,
            output: {
                filename: DIST_CONTENT_SCRIPT
            }
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: PATH_INTERNAL_ENTRIES_BROWSER,
            output: {
                filename: DIST_BROWSER_JS
            },
            plugins: [
                new html_webpack_plugin({
                    template: PATH_INTERNAL_ENTRIES_BROWSER_HTML,
                    filename: DIST_BROWSER_HTML
                })
            ]
        }),
        webpack_merge.merge(webpack_common_config, {
            entry: PATH_INTERNAL_ENTRIES_UI,
            output: {
                filename: DIST_UI
            }
        })
    ]);
};

module.exports = (mode) => build_webpack_configs({
    output: {
        path: PATH_APP_EXTENSION
    },
    ...require(PATH_APP_WEBPACK)
}, mode);
