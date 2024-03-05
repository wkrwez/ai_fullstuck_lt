var obj = {
    name:'Tom'
}



// Function.prototype.myCall = function () {
//     let obj = arguments[0] ? arguments[0] : window  //判断是否传参
//     let args = [...obj.slice(1)]
//     let key = Symbol('key')
//     obj[key] = this
//     let res = obj[key](...args)  //隐式绑定   传参
//     //会多一个属性，所以要删除
//     delete obj[key]
//     return res  //返回函数调用的返回值
// }


Function.prototype.myBind = function (obj) {
    let obj = arguments[0]
    let agrs = [...arguments].slice(1)
    let that = this
    const  back = function(...arg){
        //让that的指向指到 obj
        //back 有没有被new调用
        if(this instanceof back){
            //让new作用于that
            return new back(...arg,...agrs)
        }
        return that.apply(obj,[...arg,...agrs])
    }
}