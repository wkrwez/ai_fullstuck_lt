# vite 工程化
- 前端项目构建脚手架
    - 快速启动项目
        git 拉一个项目模板
    - 命令行工具
        代码的编译 stylus -》css
        es6+ -> es5
    - 配置
        alias等
    - 现代的 相比较于传统 webpack 速度更快
        - 不到1s  go rust 这种构建工具，比node 更快
            webpack 10s 左右 
        - script type="module" 浏览器支持ES6模块化。
            旧浏览器不支持  兼容性问题  IE11之前不支持了，
            需要webpack 把项目的所有文件先打包
            而vite基于type = module不用打包，直接加载
            更快？
- vite 让项目启动起来的流程
    - npm run dev
        - index.html 首页   启动web服务器
        