// node的文件模块
const fs = require('fs');
// 路径模块 路径字符串变路径对象
const path = require('path');
// MVC开发框架
const Koa = require('koa');

const app = new Koa();
// 中间件
app.use(async ctx =>{
    const {request:{url,query}} = ctx;
    
    console.log(url, '////////////////////');
    if(url === '/'){
        // 设置响应头 Header  types 字段
        ctx.type = 'text/html'
        //读取文件
        let content = fs.readFileSync('./index.html','utf-8');
        // 设置响应体
        ctx.body = content;
    }else if(url.endsWith('.js')){
        console.log(url,__dirname);
        // 项目根目录   有效路径
        // /src/main.js
        const p = path.resolve(__dirname,url.slice(1));
        ctx.type = 'application/javascript';
        const content = fs.readFileSync(p,'utf-8');
        ctx.body = content
    }else if(url.startsWith(/@modules/)){
        // path    node_modules vue 引入进来
        
    }
})

app.listen(12345,()=>{
    console.log('vite脚手架启动成功');
})
