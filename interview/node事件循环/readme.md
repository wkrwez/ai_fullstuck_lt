# Node.js的运行机制
1. v8引擎解析JavaScript脚本
2. 解析后的代码，调用Node API
3. libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event-loop
    ，以异步的方式将任务的执行结果返回给V8引擎。
4. V8引擎再将结果返回给用户。