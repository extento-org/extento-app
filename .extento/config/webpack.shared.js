const fs = require('fs');
const webpackMerge = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { default: WebpackWatchFilesPlugin } = require('webpack-watch-files-plugin');
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const Webpack = require('webpack');

const constants = require('./constants');

const scriptsPlugin = require(constants.PATH_WEBPACK_SCRIPTS);

if (!fs.readdirSync(constants.PATH_APP_WORKSPACES).length) {
    throw new Error(`You must first create a workspace using the cli!`);
}

process.env.EXTENTO_SELECTIVE_BUILD = constants.SELECTIVE_BUILD;

const buildWebpackCommonConfig = (common, mode) => webpackMerge.merge({
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
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'to-string-loader',
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: constants.PATH_MASTER_POSTCSS,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.md$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                    {
                        loader: 'markdown-loader',
                    },
                ],
            },
            { test: /\.json$/, exclude: /node_modules/, type: 'json' },
            {
                test: /\.(tsx|ts|js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: constants.PATH_WEBPACK_TSCONFIG,
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
        new WebpackWatchFilesPlugin({
            files: [
                `${constants.PATH_APP_STYLES}/**/*.css`,
                `${constants.PATH_APP_STYLES}/**/*.js`,
            ],
        }),
        new Webpack.WatchIgnorePlugin({
            paths: [
                constants.PATH_INTERNAL_CODEGEN,
                constants.PATH_INTERNAL_TYPES,
            ],
        }),
        ...(mode === 'development' ? [
            new Webpack.DefinePlugin({
                global: 'window',
            }),
        ] : []),
        scriptsPlugin,
    ],
}, common);

const addDevServerPorts = (webpackConfigs) => webpackConfigs
    .map((webpackConfig, i) => webpackMerge.merge(webpackConfig, {
        devServer: {
            port: 42001 + i,
        },
    }));

const buildWebpackConfigs = (common, mode) => {
    const webpackCommonConfig = buildWebpackCommonConfig(common, mode);

    return addDevServerPorts([
        webpackMerge.merge(webpackCommonConfig, {
            entry: constants.PATH_INTERNAL_ENTRIES_ONLOAD,
            output: {
                filename: constants.DIST_ONLOAD,
            },
        }),
        webpackMerge.merge(webpackCommonConfig, {
            entry: constants.PATH_INTERNAL_ENTRIES_BACKGROUND,
            output: {
                filename: constants.DIST_BACKGROUND,
            },
        }),
        webpackMerge.merge(webpackCommonConfig, {
            entry: constants.PATH_INTERNAL_ENTRIES_CONTENT_SCRIPT,
            output: {
                filename: constants.DIST_CONTENT_SCRIPT,
            },
        }),
        webpackMerge.merge(webpackCommonConfig, {
            entry: constants.PATH_INTERNAL_ENTRIES_PAGES,
            output: {
                filename: constants.DIST_PAGES_JS,
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: constants.PATH_INTERNAL_ENTRIES_PAGES_HTML,
                    filename: constants.DIST_PAGES_HTML,
                }),
            ],
        }),
        webpackMerge.merge(webpackCommonConfig, {
            entry: constants.PATH_INTERNAL_ENTRIES_UI,
            output: {
                filename: constants.DIST_UI,
            },
        }),
    ]);
};

module.exports = (mode) => buildWebpackConfigs({
    ...require(constants.PATH_APP_WEBPACK)(mode),
    output: {
        path: constants.PATH_APP_EXTENSION,
    },
}, mode);
