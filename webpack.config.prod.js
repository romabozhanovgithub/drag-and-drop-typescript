const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// webpack configuration
module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader",
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin.CleanWebpackPlugin()
    ]
};
