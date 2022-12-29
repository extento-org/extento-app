const fs = require('fs');
const webpackMerge = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { default: WebpackWatchFilesPlugin } = require('webpack-watch-files-plugin');
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const Webpack = require('webpack');

const constants = require('~/node/constants');

const webpackScriptsPlugin = require(constants.PATH_WEBPACK_CUSTOM_PLUGIN);
const styleRules = require(constants.PATH_WEBPACK_SHARED_STYLE_RULES);

if (!fs.readdirSync(constants.PATH_APP_LAYERS).length) {
    throw new Error(`You must first create a layer using the cli!`);
}

process.env.EXTENTO_SELECTIVE_BUILD = constants.SELECTIVE_BUILD;

const entries = {
    [constants.DIST_ONLOAD]: constants.PATH_INTERNAL_BRIDGE_ENTRIES_ONLOAD,
    [constants.DIST_BACKGROUND]: constants.PATH_INTERNAL_BRIDGE_ENTRIES_BACKGROUND,
    [constants.DIST_CONTENT_SCRIPT]: constants.PATH_INTERNAL_BRIDGE_ENTRIES_CONTENT_SCRIPT,
    [constants.DIST_PAGES_JS]: constants.PATH_INTERNAL_BRIDGE_ENTRIES_PAGES,
    [constants.DIST_UI]: constants.PATH_INTERNAL_BRIDGE_ENTRIES_UI,
};

const buildWebpackConfigs = (mode) => {
    const webpackCommonConfig = {
        mode,
        ...(mode === 'development' ? {
            devtool: 'inline-source-map',
        } : {}),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            plugins: [new TsconfigPathsWebpackPlugin()],
        },
        module: {
            rules: [
                ...styleRules,
                {
                    test: /\.json$/,
                    exclude: /node_modules/,
                    type: 'json',
                },
                {
                    test: /\.(tsx|ts|js|jsx)$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'ts-loader',
                        options: {
                            configFile: constants.PATH_TSCONFIGS_WEBPACK,
                            projectReferences: true,
                        },
                    }],
                },
            ],
        },
        optimization: {
            minimizer: [new TerserWebpackPlugin({
                extractComments: false,
            })],
        },
        ...(mode === 'development' ? {
            node: {
                global: false,
            },
        } : {}),
        plugins: [
            new Webpack.WatchIgnorePlugin({
                paths: [
                    constants.PATH_INTERNAL_COMPILED,
                ],
            }),
            ...(mode === 'development' ? [
                new Webpack.DefinePlugin({
                    global: 'window',
                }),
            ] : []),
        ],
    };

    return [
        webpackMerge.merge(webpackCommonConfig, {
            entry: entries,
            output: {
                path: constants.PATH_APP_EXTENSION,
                filename: '[name]',
            },
            plugins: [
                webpackScriptsPlugin,
            ],
        }),
        webpackMerge.merge(webpackCommonConfig, {
            entry: {
                [constants.DIST_PAGES_JS]: constants.PATH_INTERNAL_BRIDGE_ENTRIES_PAGES,
            },
            output: {
                path: constants.PATH_APP_EXTENSION,
                filename: '[name]',
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: constants.PATH_INTERNAL_BRIDGE_ENTRIES_PAGES_HTML,
                    filename: constants.DIST_PAGES_HTML,
                }),
            ],
        }),
    ];
};

module.exports = buildWebpackConfigs;
