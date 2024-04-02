const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports  = {
    mode:'development', //模块
    entry:'./src/main.js', //入口
    output:{               //出口
        path:path.resolve(__dirname,'./dist'),
        filename:'js/chunk-[contenthash].js',
        clean:true
    },
    plugins:[   //插件
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            inject:'head'
        })
    ],
    devServer:{
        port:8080,
        open:true,
    }
}