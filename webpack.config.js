const path = require('path');

// webpack configuration
module.exports = {
    mode: 'development',
    entry: './src/app.ts', // entry point, where webpack starts bundling
    output: { // output file, where webpack will bundle all the files
        path: path.resolve(__dirname, 'dist'), // path to the output directory
        filename: 'bundle.js', // output file name, can be anything
        // bundle.[contenthash].js // if you want to add a hash to the output file name
        publicPath: 'dist' // public path to the output directory
    },
    devtool: 'inline-source-map', // to debug the code in the browser
    module: { // module rules, how webpack will bundle the files
        rules: [ // rules array, can have multiple rules
            { // rule object, can have multiple rules, each rule is an object
                test: /\.ts$/, // used to match the file extension
                exclude: /node_modules/, // exclude node_modules folder
                use: "ts-loader", // use ts-loader to bundle the files
                // use: { // use object, can have multiple loaders, each loader is an object, loaders are executed from right to left
                //     loader: 'babel-loader', // use babel-loader to transpile js files
                //     options: { // options object, used to pass options to the loader
                //         presets: ['@babel/preset-env'] // use preset-env to transpile to es5
                //     }
                // }
            }
        ]
    },
    resolve: { // resolve object, used to resolve file extensions
        extensions: ['.ts', '.js'] // resolve .ts and .js file extensions
    },
    devServer: { // devServer object, used to configure webpack-dev-server
        static: { // static object, used to configure static files
            directory: path.join(__dirname, '/'), // path to the output directory
        },
        port: 3000 // port to run the dev server
    }
};
