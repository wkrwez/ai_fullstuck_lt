# 进程 & 线程
- 进程指的是cpu运行指令和保存上下文所需的时间
- 线程是进程中更小的单位，指的是一段指令执行所需的时间


# 浏览器新开一个tap页(进程)
1. 渲染线程
2. http请求线程
3. js引擎线程

- 线程是之间是可以一起工作的
- 渲染线程 和 js引擎线程 是互斥的


# js是单线程的
优点：
1. 节约内存
2. 没有锁的概念，节约了上下文切换的时间


# 异步
- 宏任务(macrotask):script,setTimeout,setInterval,setImmediate,I/O,UI-rendering,

- 微任务(microtask):promise.then(),MutationObserver,process.nextTick()


# Event-Loop
1. 执行同步代码(这属于宏任务)
2. 当执行栈为空，查询是否有异步需要执行
3. 执行微任务
4. 如果有需要，会渲染页面
5. 执行宏任务(下一次event-loop的开始)