# vite 之前的前端工程化脚手架

- 把项目跑起来
   静态资源： vue项目 .vue文件 css image...
   将静态资源打包一下？ 变成可执行


- 打包
    - 将src目录下的资源打包到 index.html 里面运行
    - vite/webpack 现代MVVM 开发工艺    基于命令行的后端实现
    webpack node
    vite node + go + rust

- vite webpack 比较
   - webpack 配置比较复杂 entry output plugin
      webpack 学习成本高   配置复杂
      vite相对简单
   - vite script type=module 引入main.js入口文件，
      利用了es6 Module  更快  bundless
      webpack  早期的没有es6  Module 能用
      需要webpack来打理文件的依赖关系 打包 比较慢 比vite慢1/10

- dist目录就是我们要上线的目录
- babel
   js 语法转换器 js 得到新生，最新的语法，可以放心的使用，babel会帮助我们转译
   @babel/core 核心功能
   @babel/preset-env 预处理   按环境的要求编译成相应的代码  默认 es6+ ->es5
   - webpack 是厂长  总管
   - babel 是车间主任
   - 将相应后缀的文件拉到babel 车间转译 babel-loader
      module   test /\.js$/
      编译的工作时间
