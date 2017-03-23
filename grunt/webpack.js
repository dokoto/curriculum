'use strict';

module.exports = function(grunt, options) {

    const webpack = require('webpack');
    const path = require('path');
    const ProgressBarPlugin = require('progress-bar-webpack-plugin');
    const chalk = require('chalk');

    return {
        dev: {
            cache: false,
            debug: true,
            devtool: 'source-map',
            constext: __dirname + '/src/web',
            entry: './src/web/js/main.js',
            output: {
                devtoolLineToLine: true,
                path: 'builds/core/dev/',
                publicPath: '../../',
                filename: "<%=base.appName%>.js",
                pathinfo: true,
                sourceMapFilename: "<%=base.appName%>.js.map",
            },
            stats: {
                colors: true,
                modules: options.args.verbose,
                reasons: options.args.verbose,
                hash: options.args.verbose,
                version: options.args.verbose,
                timings: options.args.verbose,
                assets: options.args.verbose,
                chunks: options.args.verbose,
                children: options.args.verbose,
                source: options.args.verbose,
                errors: options.args.verbose,
                errorDetails: options.args.verbose,
                warnings: options.args.verbose,
                publicPath: options.args.verbose
            },

            storeStatsTo: "webpackStatus",
            progress: false,
            failOnError: true,
            inline: true,

            module: {
                loaders: [{
                    test: /\.html$/,
                    loader: "underscore-template-loader"
                }, {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                }, {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }, {
                    test: /.*\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g)$/i,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=./assets/[hash].[ext]',
                        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                    ]
                }, {
                    test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                    loader: "imports?this=>window"
                }, {
                    test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                    loader: "imports?define=>false"
                }]
            },

            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "window.jQuery": "jquery"
                }),
                new ProgressBarPlugin({
                    format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
                    clear: false
                })
            ],
            resolve: {
                modulesDirectories: ['./node_modules'],
                root: './src'
            },
            resolveLoader: {
                root: './node_modules'
            }

        },
        prod: {
            debug: false,
            constext: __dirname + '/src/web',
            entry: './src/web/js/main.js',
            output: {
                path: "builds/core/prod/",
                publicPath: '../../',
                filename: "<%=base.appName%>.js",
            },

            stats: {
                colors: true,
                modules: options.args.verbose,
                reasons: options.args.verbose,
                hash: options.args.verbose,
                version: options.args.verbose,
                timings: options.args.verbose,
                assets: options.args.verbose,
                chunks: options.args.verbose,
                children: options.args.verbose,
                source: options.args.verbose,
                errors: options.args.verbose,
                errorDetails: options.args.verbose,
                warnings: options.args.verbose,
                publicPath: options.args.verbose
            },
            storeStatsTo: "webpackStatus",
            progress: true,
            failOnError: true,
            inline: true,
            module: {
                loaders: [{
                    test: /\.html$/,
                    loader: "underscore-template-loader"
                }, {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                }, {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }, {
                    test: /.*\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g)$/i,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=./assets/[hash].[ext]',
                        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                    ]
                }, {
                    test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                    loader: "imports?this=>window"
                }, {
                    test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                    loader: "imports?define=>false"
                }, {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel', // 'babel-loader' is also a legal name to reference
                    query: {
                        plugins: ['transform-runtime'],
                        presets: ['es2015']
                    }
                }]
            },
            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compressor: {
                        screw_ie8: true,
                        warnings: false
                    },
                    output: {
                        comments: false
                    },
                    mangle: {
                        except: ['$super', '$', 'exports', 'require']
                    }
                }),
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "window.jQuery": "jquery"
                }),
                new webpack.HotModuleReplacementPlugin(),
                new ProgressBarPlugin({
                    format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
                    clear: false
                })
            ],
            resolve: {
                modulesDirectories: ['./node_modules'],
                root: './src'
            },
            resolveLoader: {
                root: './node_modules'
            }
        }
    };
};
