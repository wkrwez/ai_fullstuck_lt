// 向外输出 commonjs 
//引入 node 内置的path 模块
// entry 入口 
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './index.html',
            title: '首页',
            filename:'index.html'
        })
    ]
}