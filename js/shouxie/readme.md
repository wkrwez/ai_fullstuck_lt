- 我们有一个ajax的异步获取数据的任务
- 写一个函数，并且返回promise实例，可以thenable 可以await
- promise实例初始状态为pedding this.state = "pedding"
    await p 就一直等待 
- promise 构造函数中会立即执行传给他的执行器，也就是第一个函数
    得到resolve，reject两个函数
    执行器就是异步窗口的容器 当异步任务结束后，成功就调用resolved()
    失败就调用reject(error)  this.state fulfilled|rejected
    await 执行完成，并把data 交给左边 接着返回正常的同步流程。
    