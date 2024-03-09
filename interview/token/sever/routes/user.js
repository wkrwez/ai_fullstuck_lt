const router = require('koa-router')()//use掉
const jwt = require('../utils/jwt.js')

router.post('/login',(ctx)=>{
    let user = ctx.request.body //获取到前端传来的参数
    console.log(user);
    //去数据库中查看是否存在user中一样的账号密码
    if(1){
        //创建token
        let jwttoken = jwt.sign({id:1,username:user.username,admin:true})//true管理员token
        
        console.log(jwttoken);
        ctx.body = {
            code:0,
            data:`你好${user.username}`,
            token:jwttoken //如何打造一个token

        }
    }
})

//首页开发  检验在请求头当中携带过来的token是否有效（权限控制）
router.post('/home',jwt.verify(),(ctx)=>{
    ctx.body = {
        code:0,
        data:'首页数据'
    }

})

module.exports = router