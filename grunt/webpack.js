'use strict';

module.exports = function(grunt, options) {

    const webpack = require('webpack');
    const path = require('path');
    const ProgressBarPlugin = require('progress-bar-webpack-plugin');
    const chalk = require('chalk');

    return {
        dev: {
            cache: false,
            devtool: 'source-map',
            entry: './src/web/js/app.js',
            output: {
                devtoolLineToLine: true,
                path: path.join(__dirname, '../builds/web/<%=args.mode%>/'),
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

            progress: false,

            module: {
                rules: [{
                    test: /\.html$/,
                    loader: "underscore-template-loader"
                }, {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }, {
                    test: /.*\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g)$/i,
                    use: [
                        'file-loader?hash=sha512&digest=hex&name=./assets/[hash].[ext]',
                        'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
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
                new webpack.LoaderOptionsPlugin({
                    debug: true
                }),
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
                modules: [path.join(__dirname, './src'), 'node_modules']
            }

        },
        prod: {
            entry: './src/web/js/main.js',
            output: {
                path: path.join(__dirname, '../builds/web/<%=args.mode%>/'),
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
            progress: true,
            module: {
                rules: [{
                    test: /\.html$/,
                    loader: "underscore-template-loader"
                }, {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                }, {
                    test: /\.scss$/,
                    use: ["style", "css", "sass"]
                }, {
                    test: /.*\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g)$/i,
                    use: [
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
                    options: {
                        plugins: ['transform-runtime'],
                        presets: ['es2015']
                    }
                }]
            },
            plugins: [
                new webpack.LoaderOptionsPlugin({
                    debug: false
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: true,
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
                modules: [path.join(__dirname, './src'), 'node_modules']
            }
        }
    };
};
