var path = require('path');


let rules= [
    {
        test: /\.js$/,
        use: [
            {loader: 'babel-loader'}
        ],
        exclude: /node_modules/,
        include: __dirname
    },
    {
        test: /\.less$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'less-loader' }
        ]
    },
    {
        test: /\.scss/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
        ]
    },
    {
        test: /\.css/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
        ]
    },
    {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
    },
    {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
    },
    {
        test: /bootstrap-sass\/assets\/javascripts\//,
        use: 'imports-loader?jQuery=jquery'
    },
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
        rules: rules
    },
    target: 'electron-renderer'
};