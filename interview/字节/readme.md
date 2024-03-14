# 1.如何判断对象上是否有某个属性？
    - in
    - hasOwnProperty
        无法判断对象的原型上的属性
    - Object.keys()
        无法查找不可枚举的属性
    - defineProperty()
        数据劫持

# 2.如何做大整数相加
    - BigInt(),数字后面加n


# 3.数组去重


# 4. 如何让代码成立

# 5. js中如何实现并发任务的控制
js大多情况是单线程的，但是也有多线程的实现，比如定时器，异步回调，web worker，web worker是浏览器提供的一个web api，可以将任务分配到其他线程执行，但是web worker的执行环境是完全隔离的，不能访问浏览器的api，也不能访问全局变量，只能访问worker的全局变量，但是worker的全局变量可以访问全局变量，所以可以将任务分配到worker中执行，然后worker可以访问全局变量，然后worker可以将结果返回给全局变量，这样就实现了
