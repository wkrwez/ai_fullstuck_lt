// 手写bind  args 收集了所有的参数 rest 运算符
// [...args]
Function.prototype.myBind = function(context, ...args) {
    // arguments.pop()
    // this -> context
    // this ? context? 
    // this -> fn
    if(typeof this !== 'function') { // 校验
        throw new TypeError("error");
    } 
    context = context || window
    const that = this; // func fn 提供了一个上下文 原函数对象是谁？ 
    return function fn(...innerArgs) {
        // this 被 context 盖
        return that.apply(context, [...args, ...innerArgs])
    }
}
let obj = {
    name: '陈总'
}
const bindedFn = func.myBind(obj,1, 2, 3)
bindedFn(4, 5)