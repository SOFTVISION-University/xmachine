
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const commonConfig = require('../webpack.config.common')

delete commonConfig.externals;

commonConfig.plugins = [
    new CheckerPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('development')
        },
        API: JSON.stringify(process.env.API),
        BUSINESS_ID: JSON.stringify(process.env.BUSINESS_ID)
    })
];

module.exports = commonConfig;