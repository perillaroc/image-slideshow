'use strict';
let path = require('path');
let webpack = require('webpack');
let CopyWebPackPlugin = require('copy-webpack-plugin');

let nodeModulesPath = path.resolve(__dirname, 'node_modules');

let entry= {
    // index: './app/main.js'
};

let loaders= {
    loaders: [
        {
            test: /\.json$/,
            loader: 'json-loader'
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
        filename: "main.js",
        sourceMapFilename: '[file].map'
    },
    module: loaders,
    externals: externals,
    plugins: plugins,
    resolve: resolve,
    target: 'electron-main'
};
