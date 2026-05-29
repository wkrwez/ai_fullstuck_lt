# 1.说说你对 vue 的理解

- 是什么
  是一个 js 框架，用于创建一个单页应用的 web 应用框架，主旨是为了简化 web 的开发，主要靠 MVVM 的驱动方式来实现视图的更新。

- 特性
  1. MVVM (Model - View - ViewModel)
     1.1. Model--模型层：模板，业务逻辑的代码
     1.2. View--视图层：html 页面
     1.3. ViewModel--视图模型层（用于将模型和视图进行连接通信）
  2. 组件化
     1. 代码复用
     2. 降低整体的耦合度

  3. 指令
     1. 大大减少了手动操作 DOM 的代码

# 2.说说你对 SPA 的理解

- 是什么
  只有一个 html 页面，本质上只需要控制某一个代码片段被拿到该 html 中生效而已。
- 特点
  页面在任何时候都不会重新加载，不会打断用户体验。
  存在首屏加载时间过长的情况
  不利于 SEO 搜索引擎的抓取。用服务端渲染 ssr

- 解决首屏加载过慢的手段
  1. 路由懒加载
  2. ssr:服务端渲染，在 vue 项目中再启动一个 node 服务，负责直接响应首页的代码片段，项目其他的代码依然保持原有的加载方式。这样就能让用户第一时间看到首页

# 3. 说说你对双向绑定的理解

- 是什么
  模板层的数据变更会导致视图层的更新。视图层的数据更新也会导致模板层的数据改变

- 原理 （ViewModel 的原理）
  1. 监听器：对所有的数据进行监听
  2. 解析器：对每个元素节点的指令进行解析

- 双向绑定的原理

1. vue 的数据源会被劫持，在劫持的过程中为属性做依赖收集，vue 中的观察者 Watcher 负责更新视图，依赖收集到的是观察者 Watcher 的实例对象。当属性值发生变更时会触发依赖，进而触发视图更新函数。
2. 在数据劫持的同时，vue 会编译模板，解析指令，当视图层的数据发生变更时，编译器中绑定的函数会被触发，进而获取到最新的数据值，再次通知 Watcher 去触发依赖。

# 4.vue2 和 vue3 的区别

- 选项式 API 和组合式 API - this 不需要，拥抱函数式编程 - 代码量大的话 data + methods + getters 相关的逻辑需要搬来搬去 - 组合式 可以让 reactive/ref + method（逻辑） + onMounted（生命周期） 以业务为单位在一起
  - 响应式原理
    - vue2 defineProperty （一次性代理完） 数组会有缺点（无法监听索引变化，无法拦截数组方法）
    - vue3 reactive 用的是 Proxy，有 13 种拦截方法 性能更好（懒代理:在访问对象属性时并不会立即触发代理的拦截操作，而是等到真正需要对属性进行操作时才会触发拦截器。拦截更精确，减小性能开销）
    - ref 面向对象的 get set
      因为核心就是 拦截 + track(get) + trigger(set) + effect

    - WeakMap 理解
      依赖关系收集是靠全局的唯一的 weakmap，以响应式对象为 key，再是它的一些属性，proxy 支持对对象的整体代理，可以一次性代理，值就是用 track 收集的函数数组（effects），全部执行。
      - 为什么用 weakmap
        组件有很多，响应式数据很多，路由组件很多，
        当组件下线，路由切换了，有些响应式不用维护了，weakmap 会在响应式对象被垃圾回收后自动删除相应的项。

  - v-if 和 v-for 优先级
    - v-if 优先级高 vue3 修正了 bug
      - v-if 为 false 没必要 v-for 渲染

# 5.vue 为什么不建议使用 index 作为 key?

- 虚拟 DOM
  1. 虚拟 DOM 是 vue 中的编译器将模板代码编译成对象
- diff
  1. 将新老 VDOM 的不同点找到并生成一个补丁
  - 过程:
  1. 同层比较,是不是相同节点,不相同直接废弃老 DOM
  2. 是相同点节点,比较节点上的属性,产生一个补丁包
  3. 继续比较下一层的子节点,采用双端队列的方式,尽量复用,产生一个补丁包
  4. 同上

- 为什么要有 key?
  让 diff 比较的效率更高

- 为什么不能用 index?
  因为 index 是数组下标,下标永远是固定的从 0 开始,哪怕数据只是发生了位置变更,key 就会不一样,这就会导致原本可以复用的节点被认定为不可复用,导致重新渲染,浪费渲染性能

- 可不可以用随机数作为 key
  每次数据更新,生成的 key 是不一样的,导致每次都会重新渲染,浪费渲染性能

# 6. 生命周期

- onMounted() DOM 挂载后执行（mount('#app')挂载）,渲染前
- onUpdated() DOM 更新后执行，父组件在子组件后执行钩子函数
- onUnmounted() 组件被卸载后调用，可以清除定时器，事件监听和接口请求，服务端渲染期间不调用
- onBeforeMounted() 在组件被挂载前调用
- onBeforeUpdata() 在组件因为响应式数据更新而更新其 DOM 树前调用
- onBeforeUnmount() 在组件卸载前调用
- onErrorCaptured() 捕捉了后代组件传递的错误时调用
- onRenderTracked() 当组件渲染过程中追踪到响应式依赖时调用
- onRenderTriggered() 当响应式依赖更新触发组件渲染后调用
- onServerPrefetch() 异步函数，在组件实例在服务器上被渲染之前调用

## 调用顺序

- 挂载：
  父组件 onBeforeMount
  子组件 onBeforeMount
  子组件 onMounted
  父组件 onMounted

- 更新：
  父组件 onBeforeUpdate
  子组件 onBeforeUpdate
  子组件 onUpdated
  父组件 onUpdated
- 卸载：
  子组件 onBeforeUnmount
  子组件 onUnmounted
  父组件 onBeforeUnmount
  父组件 onUnmounted

# 7. 聊聊组件通信 (子组件不能修改父组件的数据，只能传过去让父组件修改)

1. 父子通信 子组件 props 接收
2. 子父通信 子组件 emit 发布一个事件，父组件订阅该事件
3. 子父通信 子组件拿到父组件的数据并修改后 emit 出来，父组件靠 v-model 实现双向绑定
   emits(['update:modelValue'])//update 是固定的
4. 子父通信 子组件 defineExpose 暴露出来值，父组件利用 ref 读取着整个子组件对象来获取值
5. 父子通信 父组件 provide 子组件 inject
   provide('string|Symbol',value)
   indject(key,?defaultValue)
   vue 会遍历父组件链匹配对应的 key，多个父组件提供相同的 key 会取离子组件最近的
6. EventBus mitt 插件
7. vuex || pinia

# 9. v-for 和 v-if 共存吗？

1. v2 中，v-for 优先级更高，会报警告，因为性能浪费
2. v3 中，v-if 优先级更高，没有用到 for 中的变量是不会报错的

# 10. 什么是虚拟 DOM

- 从框架设计的层面：vue框架是组件开发的思想，本质是为了提升开发效率，当数据发生变更，难以精确到对应的DOM节点去更新视图，就使用js对象来描述DOM结构，这样就避免去操作大量不相干的真实DOM，最后通过diff对比找出新旧虚拟DOM的差异去更新真实DOM
- 为了在运行时解耦：如果直接去生成真实DOM，每个环境不一样，难免出现问题，通过js对象去描述UI，只要当前环境支持js，就能根据当前环境生成对应的真实DOM

1. 一个用 js 对象来描述的 DOM 结构
2. 当一次操作导致多处 DOM 更新，不使用虚拟 DOM，浏览器需要重新一个一个构建 DOM 树，导致多次渲染。
   但是少量 DOM 更新，diff 算法同样会存在性能开销。
3. 跨平台

# 11. 说说 diff

- 同层比较
- 深度优先
  pathVnode 步骤：

1. 判断节点是不是文本，是的话直接更新文本
2. 比较节点类型，属性是否相同，不同则直接替换
3. 比较子节点，不断生成补丁包

- 双端队列
  提升比较的效率

- 数据更新在 js 内存生成一个新的虚拟 DOM 和老虚拟 DOM 对比，一个个比较节点再更新，最后更新真实 DOM，虚拟 DOM 对性能的开销比对真实 DOM 操作低很多。

# 12. vue 中的修饰符

# 13. vue2 和 vue3 的区别

1. 速度更快：
   - 虚拟 DOM 实现的函数被重写，效率提升。
   - 编译模板的优化
2. 体积减小：
   - tree-shaking 更彻底:剔除类似于打印命令，未使用的代码等无用代码
     - 通过静态分析来识别和移除未使用代码的方法
       - 使用 import/export 静态导入，避免使用 require/module.export 动态导入
     - webpack 4 及以上版本默认支持
3. 更易维护
   - 函数式编程
   - 更好的 TS 支持
   - 不需要 this 引用变量，直接使用响应式变量，写法更规则，简便
4. 更接近原生语法
5. v3 template 模板中支持多个节点
6. teleport 组件
7. 响应式区别

# 14.vue 的异步组件

1. Suspense
   - default:需要加载的异步组件，一个组件只有一个，还有其他的需要再添加 Suspense
   - fallback：异步组件加载完成前展示的内容

2. defineAsyncComponent ：包裹一个 import 引入的文件，使用标签需要时渲染，接受一个返回 Promise 的函数作为参数，promise 状态改变才执行
   const AsyncComp = defineAsyncComponent(() =>
   import('./MyComponent.vue')
   );

# 17.ref 和 reactive 区别

- ref代理原始类型使用RefImpl，引用类型抛给reactive
- ref 使用在引用类型上修改需要.value，更复杂一点。
- ref 的出现是为了解决Proxy只能监听对象的问题
- 为了处理基本类型，ref会将基本类型通过RefImpl包装成一个拥有.value的对象,访问.value后触发getter或setter，以此收集依赖

## 为什么模板中不需要使用.value？

模板识别ref后会自动添加

## 为什么不在reactive中将原始类型包装成对象？

1. reactive本身不需要.value访问，包装成RefImpl对象后需要通过.value访问，导致语义混乱

## 为什么ref将引用类型丢给reactive处理还是需要.value访问

从代码看的出，RefImpl对象的构造器中将reactive代理后的对象赋值给了this.\_value,
并且如果不访问value反而访问\_value时，虽然响应式变量的value和\_value都会修改，但是因为没有经过getter，没有收集依赖，所以无法做到响应式，页面值不会变化。

        ```js
          this._value = isShallow ? value : toReactive(value)
          export const toReactive = <T extends unknown>(value: T): T =>isObject(value) ? reactive(value) : value
        ```

        ```js
        class RefImpl<T = any> {
          _value: T                          // 实例能够直接访问
          private _rawValue: T               // 不能直接访问

          dep: Dep = new Dep()

          public readonly [ReactiveFlags.IS_REF] = true
          public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

          constructor(value: T, isShallow: boolean) {
            this._rawValue = isShallow ? value : toRaw(value)
            this._value = isShallow ? value : toReactive(value)
            this[ReactiveFlags.IS_SHALLOW] = isShallow
          }

          get value() {
            if (__DEV__) {
              this.dep.track({
                target: this,
                type: TrackOpTypes.GET,
                key: 'value',
              })
            } else {
              this.dep.track()
            }
            return this._value
          }

          set value(newValue) {
            const oldValue = this._rawValue
            const useDirectValue =
              this[ReactiveFlags.IS_SHALLOW] ||
              isShallow(newValue) ||
              isReadonly(newValue)
            newValue = useDirectValue ? newValue : toRaw(newValue)
            if (hasChanged(newValue, oldValue)) {
              this._rawValue = newValue
              this._value = useDirectValue ? newValue : toReactive(newValue)
              if (__DEV__) {
                this.dep.trigger({
                  target: this,
                  type: TriggerOpTypes.SET,
                  key: 'value',
                  newValue,
                  oldValue,
                })
              } else {
                this.dep.trigger()
              }
            }
          }
        }

        ```

## RefImpl对象是什么？

是vue内部实现的类，用于ref将原始类型包装成带有响应式能力的对象，并通过getter/setter来收集/触发依赖

# 18.watchEffect 和 watch

watchEffect：里面使用到的响应式变量更改会触发
watch：指定监听的响应式变量，变量更改触发

# 19.输入框不使用 v-model 怎么实现双向绑定？

v-bind 绑定输入框自带的 value，再使用 v-on 绑定 input 事件，通过 js 监听 input 事件，接收一个参数，将参数的 value 值赋给响应式变量

# 20. vue3 响应式更新

Vue3 就是数据驱动视图，数据变 → 触发依赖 → 更新视图

- 在函数中响应式数据发生变化时，数据会同步更新，但是视图的更新会维护一个队列，在下次事件循环时批量更新。
  优先级：promise.then(微任务) > MessageChannel > setImmediate(宏任务) > setTimeout(宏任务),

```
function setChatSession(data: ChatSession, id: number) {
      const targetSession = chatSession.value.find(
        (item) => item.conversationId === id
      );
      if (!targetSession) {
        <!-- 更新后 -->
        chatSession.value.push(data);
      }
      <!-- 立即获取到最新的数据 -->
      if (chatSession.value.length > 5) {
        chatSession.value.shift();
      }
}
```

# setup

setup:是组件选项的一个特殊函数，它可以设置组件响应式数据，引入外部模块，执行副作用等操作。它是在组件实例化前执行的，它必须返回一个对象，该对象中的属性和方法会被注入到组件实例中。
setup 是无法访问 this 的，因为它在组件实例化前执行，要想访问组件实例或生命周期钩子，可以使用 getCurrentInstance 方法来获取当前组件实例的引用。

setup 函数还可以接收两个参数：props 和 context。props 参数包含组件接收的属性，而 context 参数包含了一些上下文信息，如 attrs、slots、emit 等。
props 的属性是响应式的，解构会失去响应式。如果需要解构 props 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 toRefs() 和 toRef() 这两个工具函数

# 副作用函数

这些副作用函数可以帮助你在组件的不同阶段执行一些额外的逻辑，比如初始化数据、处理异步操作、清理资源等。
生命周期
watch(deep:深度监听[对象内部属性变化，数组元素变化，对象或数组嵌套]；immediate:是否渲染就调用)、

watchEffect

# 响应式代理的区别

- object.definePropty
  当创建一个响应式数据对象时，Vue 会递归地将其属性转换为 getter 和 setter，并且在数据被访问或者修改时触发相应的依赖更新。

只会对初始对象的属性进行代理，后续添加的属性不会自动成为响应式的。这是因为 Vue2 在初始化时会递归地对对象的属性进行代理，但是对于后续添加的属性，Vue2 无法自动进行代理。无法监视数组的长度属性的变化

- Proxy(递归代理每个属性)
  1. 可以拦截对对象的各种操作，包括读取、赋值、删除等，从而更灵活地实现对对象的代理。新添加的属性会自动成为响应式的，无需额外的操作。

  2. 懒代理：只有首次访问时才会进行代理。新添加的属性也会被代理是因为这个懒代理。
  3. reactive 会最先代理最外层，存在嵌套对象会进行懒代理，全是原始数据类型不会代理成响应式。
  4. 模板使用也算访问。

# watch 和 computed 的区别

- computed 计算的结果会被缓存起来，当依赖再次变化才会重新计算，提高性能
  - 会返回一个只读的 ref 响应式对象，通过.value 使用
  - 可以通过 get 和 set 创建可写的 ref 对象
- watch 可以更深层次的监听数据变化
  - 监听一个或多个响应式数据源，以数组形式接收 -第三个参数该回调函数会在副作用下一次重新执行前调用，可以用来清除无效的副作用，例如等待中的异步请求。

# template

这上面不能写任何语法，因为他是根节点

# scope

通过设置 scope 为 true，组件内的样式会在选择器后面加上一个哈希值

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

# 数据嵌套层级很深，使用vue响应式做代理会导致页面卡顿，响应慢，怎么处理？

1. 取消非必要数据响应式代理

- vue3 ：使用shallowRef只带理第一层响应式对象；markRaw() 禁止vue代理
- vue2 ：使用Object.freeze冻结对象防止响应式代理。只冻结第一层对象，只有第一层无法直接修改，可以使用vue.set()修改冻结对象的某个数据，为单个数据做响应式

2. 数据结构扁平化
3. 数据懒加载，初始只展示一层数据，点击节点后加载子节点数据，适合长列表、树形结构。
4. 虚拟滚动，解决长数据渲染问题，每次只渲染一部分节点，数据嵌套层级深。
5. 利用vue父子组件响应式隔离，父组件只传递数据，子组件内部做浅代理，子组件更新，不影响父组件。
