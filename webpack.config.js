const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path")
module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.bundle.js"
    },
    mode: "development",
    devtool:"source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template:"./template.html"
        }),
        new CopyPlugin({
            patterns: [
                {from:path.resolve(__dirname, "src", "resources"),to:path.resolve(__dirname, "dist", "resources")}
            ]
        })
    ],
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
}