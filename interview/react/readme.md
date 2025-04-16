# react 18 新特性

1. React-createDOM
2. 批处理机制优化：更新了异步方法里面调用 state 的更新，从而减少更新次数
   react18 会将异步中的 state 算作一次更新，所以这里更新两次

```
setList([])
setCount(0)
setTimeout(() => {
     setCount(c => c + 1); // 异步更新
      setFlag(f => !f);     // 异步更新
      // React 17: 不批处理，2次渲染
      // React 18: 批处理，1次渲染
})
```

# react 18 性能优化

1. 并发渲染:根据任务的紧急程度来分配不同的优先级。并发渲染允许 React 中断正在进行的渲染工作，并在稍后恢复。其实就是 stratTransition、批处理等等。
2. 自动批处理
3. stratTransition 和 useTransition 标记非紧急更新

```
function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }


const [isPending, startTransition] = useTransition();//isPending是否处理完成
const [tab, setTab] = useState('about');

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

  ```
    function BadComponent({ shouldUseState }) {
        if (shouldUseState) {
            const [count, setCount] = useState(0); // 错误：在条件语句内部使用Hook
        }
        //正确
        const [count, setCount] = useState(0);
        useEffect(() => {})
    }
  ```

# 如何保证 react 的父组件更新，而子组件不更新

1. 使用 React.memo 包裹组件,只有 props 改变时，才会重新渲染。也可以调用第二个函数参数，自定义哪个 props 修改才更新

# react 的 input 的 onChange 事件频繁触发是否会一直渲染？

不会
虽然 state 会频繁被调用，react 会一直重新渲染
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
