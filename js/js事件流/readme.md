# 说说js中的事件触发过程
1. 从window上往事件触发处传播，遇到注册的捕获事件会触发  （捕获过程）
2. 传播到目标处触发注册的事件
3. 从事件触发处往window上传播， 遇到注册的冒泡事件就会触发  （冒泡过程）


捕获事件 和 冒泡事件是互斥的mouseenter

# 阻止默认行为
1. event.stopPropagation()   可以阻止事件流的传播
2. event.stopImmediatePropagation() 可以阻止事件流的传播 且 阻止同一个容器上绑定其他相同事件


# 事件代理 （事件委托）