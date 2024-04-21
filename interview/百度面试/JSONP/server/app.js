const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa();

app.use(cors())

app.use(async ctx => {
  ctx.body= 'Hello World';
  console.log(ctx.body);
});

app.listen(5500,()=>{
    console.log('服务端启动');
    
});