let obj={
    a:1,
    b:2
}
let n = obj.a

// 数据劫持 可以定义新属性(需要写默认值)或修改属性
Object.defineProperty(obj,'a',{
    get(){
        return n
    },
    set(newVal){
        n = newVal
    },
    // enumerable:true, // 是否可枚举
    // writable:true, // 是否可写,修改a，和set不能同时出现
    // value:true, // a的默认值
    configurable:false // 是否可配置(删除)
})
// delete obj.a
obj.a = 20
console.log(obj.a);// 其实就是访问n


//enumerable是否可枚举
// for(let key in obj){
//     console.log(key)
// }