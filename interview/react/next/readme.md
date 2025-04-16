# ssr 水合原理

- 通过判断哪个页面导出了 getServerSideProps 这个组件就是需要 ssr 的页面

1. 用户请求页面后，next 会启动 node 服务端将页面组件及其数据渲染成完整的 HTML 字符串，其中包含了页面的初始内容，服务器将 html 字符串嵌入到完整 html 文档，作为 http 响应给浏览器。浏览器接收到后，由于页面包含了初始内容，用户不需要等待 js 加载执行就可以看到页面。

2. react 会在 js 包（react 状态管理，组件逻辑，）加载准备好后，将已经存在的 DOM 接管并进行水合，替换成可交互的 react 组件。

# 水合的问题

1. 首页渲染与水合不匹配
   - 避免使用仅在客户端生效的属性或状态，如 window
2. 性能问题
   - 因为需要等待客户端加载 js 包才能进行交互，如果包的体积太大或组件树过深则耗时
     解决：使用代码分割、懒加载
3. 闪烁问题
   - 在水合之前，用户看到的页面并未进行样式化或者文本不可见，css 尚未应用或字体加载延迟
     解决：预加载关键资源，如 css，字体（使用 CSS 的 font-display，未加载完成或加载超时或加载失败时，使用备用或系统字体）等
4. 事件处理差异
   - 服务端渲染只生成了 html 并未绑定事件处理器，如果 js 包过大，加载耗时，在水合之前无法交互
     解决：优化前端资源加载顺序，优先加载交互脚本
5. 状态管理
   - 服务端渲染生成的数据需要在水合之后继续使用
     解决：可以考虑使用 Next.js 提供的 getServerSideProps、getStaticProps 等数据获取方法，或是 Redux、Context API 等状态管理工具，以确保状态在服务端和客户端间正确传递。

# ssg

SSG（静态站点生成）

- 定义：

静态站点生成（Static Site Generation, SSG）指的是在构建阶段预先生成网站的所有页面为静态 HTML 文件。这些文件可以直接由 CDN 等静态资源服务器提供服务，无需在每次请求时重新渲染。

- 工作流程：

在构建时，Next.js 会遍历所有可能的路由，对于每个路由，它会执行必要的数据获取逻辑（如通过 getStaticProps 获取数据），并基于此数据生成对应的 HTML 文件。
这些 HTML 文件会被部署到服务器或 CDN 上。
当用户请求某个页面时，直接从服务器或 CDN 获取相应的静态 HTML 文件并展示给用户。

- 优点：

极高的性能和低延迟，因为页面可以直接从 CDN 提供服务。
减轻了服务器负担，因为它不需要在每次请求时都处理页面生成逻辑。
适用于内容不经常变化的场景，如博客、文档等

# rsc 和 ssr 水合区别

- rsc 是服务端组件，它运行在 node 服务器，不能使用任何与客户端相关的钩子和属性，如 useEffect、useState 、window 等。
  通过文件名.server.jsx 或 app 下的特定目录来区分 rsc 组件。

  优点：

  1. rsc 组件会在服务端执行和渲染，生成 html 字符串返回给前端
  2. rsc 支持流式传输 html 到客户端，说明页面的不同部分可以独立渲染，加快页面渲染
  3. 水合：只有被标记为客户端组件才会进行水合，在 rsc 中使用客户端组件，该客户端组件被进行水合并且在客户端加载和渲染。rsc 组件本身不会被水合。rsc 本身不进行交互，嵌套使用的客户端组件用于交互

区别：当请求某个页面时，rsc 只有交互部分才会被水合，ssr 是整个页面都会被水合

# 如何判断哪个页面需要 ssr

getServerSideProps(context)：路由信息，请求信息

1. 抛出了 getServerSideProps（每次页面请求时，ssr） 、getStaticProps（SSG，构建时） 、getStaticPaths （SSG，构建时）这个方法。
   注意：同一个页面不能同时使用 getServerSideProps（每次页面请求时，ssr）、getStaticProps（SSG，构建时）

2. 查看页面源码
3. 使用 next.config.js 监控

```
module.exports = {
experimental: {
  reactRoot: true,
},
// 开启详细构建日志
webpack: (config, { isServer }) => {
  if (isServer) {
    console.log('检测到服务端渲染页面');
  }
  return config;
}
}
```

## 混合使用 ssr 和客户端渲染

1. 抛出 getServerSideProps ，使用 useEffect 获取数据
