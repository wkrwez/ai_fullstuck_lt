//koa路由,需要安装
const Router = require('@koa/router')
const router = new Router()
const { userLogin, userFind, userPut } = require('../controllers/mysqlControl.js')

//添加路由前缀
router.prefix('/user')

//定义接口,登陆
router.post('/login', async (ctx) => {
    // console.log(ctx.request.body);//获取到了前端传递的参数
    const { username, password } = ctx.request.body
    //校验登陆
    try {
        const result = await userLogin(username, password)
        // console.log(result);
        if (result.length) { //查到了
            let data = {
                id: result[0].id,
                nickname: result[0].nickname,
                username: result[0].username
            }
            ctx.body = {
                code: '8000',
                data: data,
                msg: '登陆成功'
            }
        } else {
            ctx.body = {
                code: '8004',
                data: data,
                msg: '账号或密码错误'
            }

        }
    } catch (err) {
        ctx.body = {
            code: 8005,
            data: err,
            msg: '服务器异常'
        }
    }

})

//注册接口
router.post('/register', async (ctx) => {
    //  console.log(ctx.request.body);
    const { nickname, username, password } = ctx.request.body
    if (!nickname || !username || !password) {
        ctx.body = {
            code: 8001,
            msg: '账号密码或昵称不能为空'
        }
        return
    }

//捕捉服务器异常
    try {
        //校验数据库是否存在该账号
        const findRes = await userFind(username)
        console.log(findRes);
        if (findRes.length) {//账号已存在
            ctx.body = {
                code: 8003,
                data: 'error',
                msg: '账号已存在'
            }
            return
        }
        //数据库写入数据
        const res = await userPut(username, password, nickname)
        // console.log(res);
        if (res.affectedRows !== 0) {
            ctx.body = {
                code: '8000',
                data: 'success',
                msg: '注册成功'
            }
        } else {
            ctx.body = {
                code: '8001',
                data: 'fail',
                msg: '注册失败'
            }
        }
    } catch (err) {
        ctx.body = {
            code: '8005',
            data: 'error',
            msg: '服务器异常'
        }
    }

})

module.exports = router
