# HashRouter

- 不会去发请求，所以不会刷新页面，#是用来指导浏览器的动作，不会包含在请求中。
  通过监听 js 的 hashchange 事件，将 location 的 hash 值与路由的 component
  比较，将相同的拿到根结点去展示。可以通过监听页面 DOM 生成事件在页面初次渲染是触发。

# history

不会重新加载页面，通过 js 改变 URL，需要服务端配合

- 为什么需要服务端配合？

1. 用户直接访问 History 的 URL 时服务器无法响应 URL，因为这 URL 是前端路由状态，而服务器不存在这个文件路径，
2. 服务端需要配置 fallback 机制

- 什么是 fallback 机制
  将 history 的 URL 请求重定向传回给前端入口文件，让前端处理

  1. 使用后端路由
  2. CDN 配置 fallback

- 利用 history.pushState() 和 replaceState() API 操作实现 URL 的变化
  pushState 用于向浏览器的历史栈添加新记录，改变 url
  replaceState 替换浏览器的历史栈内容，改变 url

# 哈希模式和历史模式

- 哈希模式（Hash Mode）：
  在哈希模式下，路由会使用 URL 中的哈希部分（即 # 符号后面的内容）来模拟路由的改变。
  哈希模式的 URL 结构类似于 http://example.com/#/path/to/route。
  优点：是哈希模式可以确保路由切换不会导致页面的刷新，因为哈希部分的改变不会触发页面的重新加载。
  缺点：是哈希模式的 URL 略显复杂，且不太友好，不利于 SEO。

- 历史模式（History Mode）：
  在历史模式下，路由会使用 HTML5 History API 中的 pushState 和 replaceState 方法来实现路由的改变。
  历史模式的 URL 结构更加简洁，类似于常规的 URL，如 http://example.com/path/to/route。
  优点：是历史模式的 URL 更加友好，有利于 SEO，并且不会显示哈希部分。
  缺点：是历史模式需要服务器的支持，因为直接访问历史模式下的 URL 时，服务器需要正确处理这些 URL，并返回相应的页面。

在哈希模式下，路由切换不会导致页面的刷新，而是只会改变 URL 中的哈希部分，因为哈希部分的改变不会触发浏览器的页面重新加载。这是因为浏览器在解析 URL 时，会将哈希部分解析为页面的锚点（anchor），而不会向服务器发送请求。因此，即使哈希部分发生变化，浏览器也不会重新加载页面。

##

当使用 Vue Router 或其他前端路由库时，它们会通过监听浏览器的 URL 变化来实现路由切换。在哈希模式下，路由库会监听浏览器的 hashchange 事件，当 URL 的哈希部分发生变化时，路由库会根据新的哈希部分来匹配对应的路由，并更新页面中的组件或视图，而不会触发整个页面的重新加载。

这种方式带来了一些优势：

路由切换更加快速，因为不需要重新加载整个页面。
用户体验更流畅，因为页面切换时不会出现白屏或闪烁的情况。
但同时也有一些缺点：

URL 略显复杂，不够友好，不利于 SEO。
无法直接使用浏览器的后退、前进功能，需要通过 JavaScript 控制路由的切换。
总的来说，哈希模式在前端单页面应用（SPA）中是一种常见的路由模式，特别适用于不支持 HTML5 History API 的浏览器环境。
