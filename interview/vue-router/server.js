//服务端的fallback机制，使用koa的路由实现

const Koa = require('koa');
const Router = require('@koa/router');
const send = require('koa-send'); // 用于发送文件

const app = new Koa();
const router = new Router();

// 配置后端路由
router.get('/api/*', async (ctx) => {
  // 处理API请求的路由
  ctx.body = { message: 'API endpoint' };
});

// 处理无法匹配的路由
router.get('*', async (ctx) => {
  // 发送前端应用的入口文件
  await send(ctx, 'index.html', { root: __dirname + '/public' });
});

// 使用Koa中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
