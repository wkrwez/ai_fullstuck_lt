# React Router
通过点击链接来更新URL，不会向服务器发送请求。并且应用程序可以立即渲染新的UI，使用fetch请求数据，用新数据更新页面。

- createBrowserRouter
    用于创建一个基于浏览器历史记录的路由实例，通常和Router组件配套使用，提供单页面应用的路由功能
    - action: 发送非获取提交（“post”、“put”、“patch”、“delete”）时，就会调用操作,通常用于表单提交。
        - param: 接收URL动态段参数
        - request：发送到路由的请求的实例，Object.fromEntries用于将一个键值对的迭代器或可迭代对象转换成一个对象

# Link
使用Link标签就不会向服务器发送请求，而是在浏览器中改变URL，不会刷新页面。

# 数据加载的API
- loader 
是一个异步函数，用于在路由组件挂载之前异步加载数据。加载器在服务端渲染和客户端渲染前异步加载数据,可以访问 URL 参数和其他上下文信息。loader函数返回的数据可以通过 useLoaderData 钩子在路由组件中访问。
- useLoaderData
帮助我们拿到loader函数返回的数据。
不会发起fetch，而是读取react-router内部管理的请求的数据。它仅在操作或某些导航后再次调用加载器时才会更改
如果数据还未加载会返回null，直到数据加载完成才会渲染组件

# ：
path: "contacts/:contactId", //:代表URL中的动态段，URL参数param

param通过与动态段匹配的键传递给loader

# action