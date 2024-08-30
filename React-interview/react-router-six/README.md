# 几种路由模式

- BrowserRouter
  后台需要配置，原理是使用 window.history

- HashRouter

1. URL 多了#前缀
2. 服务端渲染比较复杂

- memoryRouter
  内存型路由
  单测

- staticRouter
  一般用于 nodejs 进行服务端渲染使用
- node 没有 window 环境，用不了 BrowserRouter，staticRouter 只关心当前匹配的路由的内容，与其他路由无关，一定程度上提升了性能。

- nativeRouter
  ios，android 端使用

# useLocation

可以获取一些 navigate,link 的信息

# 动态路由

需要完全匹配，通过 useParams 获取参数

# useSearchParams

获取到 URL？拼接的路由参数 useSearchParams,多个参数&拼接,通过 setSearch 修改增加参数
?name=123
const [search, setSearch] = useSearchParams();
console.log(search.get("name"));
setSearch({ name: 123 })

# useMatch

当与当前路由匹配时，返回当前匹配的路由信息

# 数据路由

传统路由：初始化 -> 路由切换，加载页面 -> 分包加载 -> 生命周期，拉取数据 -> 页面渲染

数据路由：初始化 -> 路由切换，加载页面 && 分包加载 && 生命周期，拉取数据 -> 页面渲染
并发加载，加快了页面渲染的速度

# Router v6.4 解决的核心问题

它是为了解决瀑布流问题而生的
可以实现并行加载（核心）

1. 路由对应的 UI 页面 /app ->App 组件
2. 分包组件的 js
3. 拉取组件或页面需要的数据

# 数据路由写起来比较复杂

1. 将数据耦合到 UI 中，增加了项目的耦合性，维护成本升高
2. 带来了直观的性能提升
