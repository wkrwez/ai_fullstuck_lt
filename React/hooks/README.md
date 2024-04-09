# Hooks
- 让函数组件更强大的钩子
- hooks 只能在函数组件中使用


1. useState() 为函数组件提供状态 
2. useEffect() 默认执行一次，当组件中有状态变更导致组件重新渲染，该函数会重新执行
    1. 可以充当 componentDidMount
    2. 可以充当 componentDidMount