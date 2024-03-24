const Koa = require('koa')

const app = new Koa

const main = (ctx) =>{//ctx === req + res
    // console.log(ctx.url,ctx.request.query);

    // ctx.body=`Hello${ctx.query.id}` //页面显示
    if(ctx.url.startsWith('/login')){
        //前端登陆
        ctx.body = {
            data:[
                {id:1,name:'lt'}
            ]
        }

    }else if(ctx.url.startsWitch('/home')){
        //访问首页
    }
}
app.use(main)

app.listen(3000,()=>{
    console.log('项目已启动');
})