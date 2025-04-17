# react

- 是什么
  用于构建用户页面的 JavaScript 库，只提供了 UI 层面的解决方案；遵循组件设计模式、声明编程范式和函数式编程概念‘
  遵循从高阶组件到低阶组件的单向数据流。
- 特性
  1. JSX 语法(Javascript XML 缩写，允许在 Javascript 中编写 HTML 代码，更加直观易懂，最终会编译为纯 JavaScript 代码)
  2. 单向数据绑定
  3. 虚拟 DOM
  4. 声明式编程
  5. 组件化

# react 和 vue 的区别

不同：

1. react 是一个库，只关注视图层的变化，需要使用其他工具集成完成状态管理和路由等，更加灵活。vue 是完整框架，提供视图到状态管理再到路由的全套解决方案。
2. react 是单向数据流，vue 是双向绑定数据
3. react 一个函数或类就是一个组件，vue 一个文件一个组件
4. react 使用 hooks 管理状态和副作用，vue 使用生命周期
5. react 使用原生 js 语法，vue 使用大量指令
6. react 使用 useState 管理状态，vue 使用响应式。
7. react 使用 jsx 允许在 js 中编写 HTML，vue 使用模板语法允许 HTML 使用指令和表达式

相同：

1. 都使用了虚拟 DOM，都是 js 单页应用框架
2. 都使用了数据驱动模式，数据驱动视图，不需要手动操作 DOM

# 1.单页面与多页面的区别

## 多页面实际上是多个 html，通过 window.location 互相跳转

- 好处
  SEO 友好，适合 C 端项目，隔离性好，每一个页面是一个独立的项目，每个项目可以由单独的团队负责
- 缺点
  每个页面的跳转都需要刷新，重新加载资源，性能不好

## 单页面

- 好处
  在一个 html 中进行路由跳转，实际上是通过 js 去控制的，React、vue。比较适合 B 端项目，不考虑 SEO。
  页面跳转不刷新，性能较好，用户体验好，可以实现代码复用。
- 缺点
  SEO 不好
  服务端渲染，元标签标题（<title>）、描述（<meta name="description">）等，懒加载优化

# 2.react-router 和 react-router-dom 区别

react-router-dom 浏览器专用，采用 react-router 库

# 3.BrowserRouter 在配置的时候有没有什么问题

1. 需要后台配合，否则出现 404。前端什么时候需要页面数据，什么时候是接口请求，服务端需要通过匹配通配符来作出响应(http://juejin.cn/api/app、http://juejin.cn/app)

# 4.组件通信

1. 父子：props
2. 父子：context：在组件树中传递数据，不需要一层一层传递 props
   export const AppContext = createContext();
   父：
   const [value, setValue] = useState("Initial Value");
   <AppContext.Provider value={{ value, setValue }}>
   {children}
   </AppContext.Provider>
   子：
   const { value, setValue } = useContext(AppContext);

3. 子-父：callback 回调函数
4. 子-父：父组件使用 useRef 将 ref 传递给子组件，子组件通过 forwardRef 获取到 ref，使用 useImperativeHandle 定义方法，父组件通过 ref.current 调用子组件的方法
5. EventBus：是一种发布-订阅模式的通信机制，适用于跨层级组件的通信。可以使用第三方库如 mitt 来实现。
6. 使用 Redux

# 5.阻止渲染

1. React.memo
2. shouldComponentUpdate
