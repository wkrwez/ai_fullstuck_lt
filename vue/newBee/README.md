
# 前端开发准备
 ## 安装
- 安装yarn
   npm i -g yarn
- 创建项目 
   npm create vite@latest my-vue-app(项目名字)
   yarn create vite my-app(项目名字)
- 安装依赖
   npm i 
   yarn
- 跑项目
   yarn dev
   npm run dev
   yarn add less -D(css的less应用)
## vue页面
- 快捷键
   vb3s
- 移动端适配(lib-flexible)
   yarn add lib-flexible
   在全局main.js中引入 import 'lib-flexible';
- reset.css
   初始样式，一个网站
   全局引入 import 'reset-css'
- vant 移动端UI框架
   安装yarn add vant
   简单使用方式：import { Button } from 'vant';
            import 'vant/lib/index.css';
            const app = createApp(App)
            app.use(Button)  —— 要在(挂载)app.mount('#app')前面引用
## 页面开发准备
- 配路由，展示各种单页面
   1. 安装：yarn add vue-router@4
   2. 准备：js文件夹 import { createRouter,createWebHistory } from 'vue-router';

   const routes = []

   const router = createRouter({
   history: createWebHistory(),
   routes(这个是key):routes
   })
   export default router(抛出路由)

   全局引入import router from './router.js'并app.use(router)
   3. 配路由
      const routes = [
         {
               path: '/login',
               name: 'login',
               component: () => import('@/views/Login.vue')
         }]
