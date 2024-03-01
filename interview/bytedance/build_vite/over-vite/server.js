//后端框架
//服务器端  vite  是用服务器来实现的
const Koa = require('koa');
const fs = require('fs');  //node 文件系统  内置的模块
//实例化Koa就是一个后端应用  OOP
const app = new Koa();

// ctx 对象  ctx.body  响应体
app.use(async ctx=>{
    //上下文对象
    //Http 基于请求响应的简单协议
    //index.html返回给用户就看到首页了
    //字符串二进制流
    //代码在内存中运行
    //读取文件系统的index.html  fs
    //js 异步 同步化
    //I/O 花时间
    let content = fs.readFileSync('./index.html','utf-8');//同步读取文件
    ctx.body = content
})

// 后端启动web服务  监听5174
app.listen(5175,()=>{
    console.log('服务器启动成功');
})  