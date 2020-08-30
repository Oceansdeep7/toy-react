const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
    entry: './main.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]]
                    }
                }
            }
        ]
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    devServer: {
        hot: true
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
    })]
}
