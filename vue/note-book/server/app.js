const Koa = require('koa') //koa接收不了post的参数
const bodyParser = require('koa-bodyparser')//解析post参数
const cors = require('koa2-cors')
const app = new Koa()
const user = require('./routes/user.js') //后端路由


app.use(bodyParser())
app.use(cors())


//用路由处理接口过多，所以废弃这个
// const main = (ctx)=>{
   // console.log(ctx.request.body);
// }
// app.use(main)

// 让user.js的都生效
app.use(user.routes(),user.allowedMethods())


//任何代码都不能放在它后面
app.listen(3000,()=>{
    console.log('项目启动在3000');
})