var path = require('path');


let loaders= [
    {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
    },
    {
        test: /\.less$/,
        loader: "style!css!less"
    },
    {
        test: /\.scss/,
        loader: "style!css!sass"
    },
    {
        test: /\.css/,
        loader: "style!css"
    }
];

module.exports = {
    entry: {
        index: './src/client/index.js'
    },
    output: {
        path: path.join(__dirname, './dist/app/scripts'),
        filename: '[name].entry.js'
    },
    module: {
        loaders: loaders
    }
};