# 1.单页面与多页面的区别
## 多页面实际上是多个html，通过window.location互相跳转
- 好处
    SEO友好，适合C端项目，隔离性好，每一个页面是一个独立的项目，每个项目可以由单独的团队负责
- 缺点
    每个页面的跳转都需要刷新，重新加载资源，性能不好
## 单页面
- 好处
    在一个html中进行路由跳转，实际上是通过js去控制的，React、vue。比较适合B端项目，不考虑SEO。
    页面跳转不刷新，性能较好，用户体验好，可以实现代码复用。
- 缺点
    SEO不好
    服务端渲染，元标签标题（<title>）、描述（<meta name="description">）等，懒加载优化

# 2.react-router和react-router-dom区别
react-router-dom浏览器专用，采用react-router库

# 3.BrowserRouter在配置的时候有没有什么问题
1. 需要后台配合，否则出现404。前端什么时候需要页面数据，什么时候是接口请求，服务端需要通过匹配通配符来作出响应(http://juejin.cn/api/app、http://juejin.cn/app)