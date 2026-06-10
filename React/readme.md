# ErrorBoundary 和 Suspense

## ErrorBoundary：

- 原理
  源码中捕获组件throw的error

1. React的ErrorBoundary（原生只支持类组件）,在组件发生JS错误时，使用备用ui

   ```jsx
   <ErrorBoundary fallback={<div>小部件加载失败啦！</div>}>
     <MyWidget />
   </ErrorBoundary>
   ```

   - 缺点
     1. 事件处理函数中的错误（如 onClick）
     2. 异步代码
     3. 服务端渲染（特定场景）
     4. 无法捕获组件自身的错误

## Suspense

- 原理
  Suspense 是捕获组件 throw 的 promise

## 它们两个会不会冲突？

- throw promise 时不会触发ErrorBoundary
- 组件throw new Error() 时会冲突

## use hooks

- 参数
  promise | React.Context：const context = createContext()
- 原理
  可以在条件、循环语句、try catch 块中调用
  必须在组件或hooks中使用use
- 状态
  当promise pending时，展示suspense fallback
  当promise resolve时，展示 suspense 的子组件
  当promise reject时，展示 ErrorBoundary fallback
  当参数是Context时，读取并返回当前组件树中最近的 Provider 提供的值，没有则使用默认值。
- 提问：try catch 是否可以捕获use的promise reject？
  只能捕获use本身的错误，如传入非法参数。

# useEffect

- 副作用在组件卸载时执行

## 依赖数组

react 使用Object.is 来比较依赖项，对象比较引用地址
无依赖数组只会在首次渲染时执行。
依赖数组为空时，每次渲染都会执行。

1. 依赖数组放普通对象会发生什么？

- 每次渲染effect都会重新执行，因为每次重新渲染，对象的引用地址都是新的，导致重新执行
- 存放state对象时，state的引用比较稳定。

2. 怎么解决？

- 使用useMemo 缓存对象
- 使用useRef
- 使用原始值

# useState

初始化函数只在首次挂载时执行一次，useState创建的对象引用在组件的生命周期内保持不变。

1. state更新，整个组件是否会更新？
   - 整个组件，包括子组件都将会更新。
   - state 会批量更新，引用地址一样会跳过更新state。
     原始值：值相同会跳过，Object.is(5, 5)，相同则跳过
     引用类型：Object.is({}, {})，引用地址不同，重新渲染
     Object.is(objState, objState)，同一个state，跳过
2. 更新嵌套对象时

- 逐层展开，直到抵达更新的层级
- 使用immer
- use-immer

```js
const [user, setUser] = useState({
  name: "Tom",
  profile: {
    age: 20,
    address: {
      city: "Beijing",
      zip: "100000",
    },
  },
});
// 修改 address.city，需要逐层展开
const updateCity = (newCity) => {
  setUser((prev) => ({
    ...prev, // 第一层：user
    profile: {
      ...prev.profile, // 第二层：profile
      address: {
        ...prev.profile.address, // 第三层：address
        city: newCity, // 实际修改的字段
      },
    },
  }));
};
const updateCity = (newCity) => {
  setUser(
    produce((draft) => {
      // immer
      draft.profile.address.city = newCity;
    }),
  );
};
// use-immer
const updateCity = (newCity) => {
  setUser((draft) => {
    draft.profile.address.city = newCity;
  });
};
```

## onClick{()=> setCount(1)} 和 onClick{setCount(1)} 有什么区别？

- onClick{()=> setCount(1)} 创建一个函数引用给 onClick，点击时调用。
- onClick{setCount(1)} onClick存储setCount的返回值undefined，组件每次渲染时执行，导致多次渲染报错。点击不执行。

# react 18 性能优化

1. 并发渲染:根据任务的紧急程度来分配不同的优先级。并发渲染允许 React 中断正在进行的渲染工作，并在稍后恢复。其实就是 stratTransition、批处理等等。
2. 自动批处理
3. stratTransition 和 useTransition 标记非紧急更新

```js
function selectTab(nextTab) {
  startTransition(() => {
    setTab(nextTab);
  });
}

const [isPending, startTransition] = useTransition(); //isPending是否处理完成
const [tab, setTab] = useState("about");

function selectTab(nextTab) {
  startTransition(() => {
    setTab(nextTab);
  });
}
```

4. suspense 扩展，允许组件的部分内容先加载，包裹的内容后续延迟加载

# react 的 hooks 为什么不能在条件语句或者循环语句使用？

- react 的 hooks 只能在组件的顶层定义和使用，确保调用顺序
- react 会对 hooks 维护一个类似于链表的结构，将 hooks 的顺序记录下来，保证 hooks 的调用顺序。
  如果在循环或者条件语句中调用 hooks，就会导致 hooks 的调用顺序和预期不一致，从而导致错误。
  如下

  ```js
  function BadComponent({ shouldUseState }) {
    if (shouldUseState) {
      const [count, setCount] = useState(0); // 错误：在条件语句内部使用Hook
    }
    //正确
    const [count, setCount] = useState(0);
    useEffect(() => {});
  }
  ```

# 如何保证 react 的父组件更新，而子组件不更新

1. 使用 React.memo 包裹组件,只有 props 改变时，才会重新渲染。也可以调用第二个函数参数，自定义哪个 props 修改才更新

# react 的 input 的 onChange 事件频繁触发是否会一直渲染？

不会
虽然 state 会频繁被调用，react 会一直重新渲染,通过虚拟DOM的diff比较，只会更新真正变化的真实DOM。
但是 filber 会合并或丢弃这些渲染，优先处理用户交互，在协商状态下中断渲染，在合并状态下等待浏览器空闲时将多次渲染合并为一次渲染。使得更频繁。

## filber

- react16 引进的新特性，将渲染任务分成多个小任务，在浏览器空闲时逐步完成任务。通过链表的形式遍历组件树。
  - React 使用 Scheduler 来管理这些更新的优先级，并根据优先级动态调整渲染顺序。

- 协调阶段：

1. 创建 filber 树，根据组件树创建 filber 树（临时的，需要与旧的组件树对比），将组件的 props、state、hooks 等信息保存在 filber 上。
2. 可中断渲染，通过时间片决定暂停或继续

合并阶段：

1. 将计算好的更新应用到 DOM 上
2. 无法中断
