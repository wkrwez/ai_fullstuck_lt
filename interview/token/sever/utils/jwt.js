const jwt = require('jsonwebtoken');


//生成token
function sign(option) {
    return jwt.sign(option, '666', {//账号 加盐（加在账号里面，写死的）
        expiresIn: 60   //token有效时长(s)
    })
}

//检验token是否有效
const verify = ()=> (ctx,next) =>{//将verify打造为函数
    let jwtToken = ctx.req.headers.authorization;
    if (jwtToken) {
        //验证token是否有效
        jwt.verify(jwtToken, '666', (err, decode) => {
            if (err) {//前端传的token有问题
                ctx.body = {
                    status: 401,
                    message: 'token失效'
                }

            } else {
                next()
            }
        })
    } else {
        ctx.body = {
            status: 401,
            message: '请登录,提供token'
        }
    }
}

module.exports = {
    sign,
    verify
}