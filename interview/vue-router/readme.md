# HashRouter
- 不会去发请求，所以不会刷新页面，#是用来指导浏览器的动作，不会包含在请求中。
通过监听js的hashchange事件，将location的hash值与路由的component
比较，将相同的拿到根结点去展示。可以通过监听页面DOM生成事件在页面初次渲染是触发。

# history
不会重新加载页面，通过js改变URL，需要服务端配合

- 为什么需要服务端配合？
1. 用户直接访问History的URL时服务器无法响应URL，因为这URL是前端路由状态，而服务器不存在这个文件路径，
2. 服务端需要配置fallback机制
- 什么是fallback机制
    将history的URL请求重定向传回给前端入口文件，让前端处理
    1. 使用后端路由
    2. CDN配置fallback

- 利用 history.pushState() 和 replaceState() API 操作实现 URL 的变化
    pushState用于向浏览器的历史栈添加新记录，改变url
    replaceState替换浏览器的历史栈内容，改变url