let obj = {
    a:1,
    b:undefined,
    c:{
        n:2
    }
}

function hasProperty(obj, key) {
    // 属性不可枚举时，判断不了
    // return Object.keys(obj).includes(key)

    // 只能查找显示的属性
    // return obj.hasOwnProperty(key)

    // 上面判断不了的都能判断
    return key in obj
}
console.log(hasProperty(obj,'a'));

