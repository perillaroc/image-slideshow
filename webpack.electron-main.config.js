'use strict';
let path = require('path');
let webpack = require('webpack');
let CopyWebPackPlugin = require('copy-webpack-plugin');

let nodeModulesPath = path.resolve(__dirname, 'node_modules');

let entry= {
    index: './src/app/main.js'
};

let modules= {
    rules: [
        {
            test: /\.json$/,
            use: [
                { loader: 'json-loader' }
            ]
        }
    ]
};

let resolve = {};

let plugins = [
    new CopyWebPackPlugin([
        {'from': './src/app'}
    ])
];

let externals= {};

module.exports = {
    devtool: "source-map",
    entry: entry,
    output: {
        path: path.join(__dirname, './dist/app'),
        filename: "main.bundle.js",
        sourceMapFilename: '[file].map'
    },
    module: modules,
    externals: externals,
    plugins: plugins,
    resolve: resolve,
    target: 'electron-main'
};
