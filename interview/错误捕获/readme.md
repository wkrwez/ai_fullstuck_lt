# window.addEventListener('error')

图片、css、脚本加载失败

# unhandledrejection捕获未处理的promise reject

异步被吞并，需要显示处理

# 框架级错误边界,兜住组件渲染错误

1. React的ErrorBoundary（原生只支持类组件）,在组件发生JS错误时，使用备用ui

   ```react
   <ErrorBoundary fallback={<div>小部件加载失败啦！</div>}>
       <MyWidget />
   </ErrorBoundary>
   ```

   - 缺点
     1. 事件处理函数中的错误（如 onClick）
     2. 异步代码
     3. 服务端渲染（特定场景）
     4. 无法捕获组件自身的错误

2. Vue的errorCaptured
   生命周期函数，当子组件有未被捕获的错误时，会冒泡到拥有errorCaptured生命周期的父组件

   ```
   onErrorCaptured((err, instance, info) => {
      console.warn('捕获到后代组件错误:', err.message)
      console.log('错误组件实例:',instance)
      console.log('错误来源:',info)
      hasError.value = true // 同样，返回 false 可以阻止错误继续向上冒泡
      return false
    })
   ```

   - 缺点
     1. 只能捕获同步错误
     2. 未处理的promise拒绝
     3. 无法捕获组件自身的错误
     4. 服务端渲染（特定场景）
   - 兜底方案

     ```
     // main.js
     import { createApp } from 'vue'
     import App from './App.vue'

     const app = createApp(App)

     app.config.errorHandler = (err, instance, info) => {
     console.error('全局捕获到未处理的错误:', err)
     // 可以在这里将错误上报给监控平台（如 Sentry）
     }

     app.mount('#app')
     ```

# 跨域脚本错误

给script标签加上crossorigin="anonymous"属性，并确保CDN返回Access-Control-Allow-Origin头，才能拿到详细堆栈
