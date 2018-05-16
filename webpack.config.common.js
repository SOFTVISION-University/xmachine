const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ENVIRONMENT = process.env.NODE_ENV;
const path = require('path');

module.exports = {
    entry: {
        bundle: './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist'),
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.webpack.js',
            '.web.js'
        ]
    },
    stats: {
         // Examine all modules
        maxModules: Infinity,
        // Display bailout reasons
        optimizationBailout: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    `awesome-typescript-loader?useBabel`
                ],
                exclude: /(node_modules|dist|examples)/
            },
            {
                test: /\.md$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: 'file-loader?name=fonts/[hash].[ext]'
            },
            {
                test: /\.css?$/,
                loaders: ['style-loader/useable', 'raw-loader']
            },
            {
                test: /\.svg(\?.*)?$/,
                loader:
                    'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader/useable', 'css-loader', 'sass-loader']
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            },
            {
                test: /font-awesome\.config\.js/,
                loaders: ['style-loader', 'font-awesome-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([
            path.resolve('./dist'),
            path.resolve('./typings')
        ]),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    failOnHint: true
                }
            }
        })
    ]    
};
