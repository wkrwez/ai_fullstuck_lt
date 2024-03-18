//koa路由,需要安装
const Router = require('@koa/router') //是函数需要再调用
const router = new Router()

//定义接口
router.post('/user/login',(ctx)=>{
    console.log(ctx.request.body);//获取到了前端传递的参数
})

module.exports = router
