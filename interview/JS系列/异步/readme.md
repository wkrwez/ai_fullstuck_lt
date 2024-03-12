# 说说异步的发展史
1. 回调:回调地狱，函数里面调用函数    代码维护困难，排查错误困难

2. Promise:

3. generator
    - 可以分段执行，可以暂停
    - 可以知道是否执行完毕
    - 可以控制每个阶段的返回值

4. async/await === promise + generator
    - 原理：generator控制异步执行是靠promise的状态变更在手动控制next的执行，
    async/await 的优雅性的原理体现在自动的执行generator函数中的next，控制yeild的释放，主要的实现方式就是递归调用 next，next的执行结果需要为promise对象，next的递归调用应该在上一个next执行结果的promise状态变更为fulfilled后才递归，这样就能实现上一个yeild后面的语句彻底执行出结果后才执行下一个。