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
