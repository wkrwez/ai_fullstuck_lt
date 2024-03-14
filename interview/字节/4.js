Object.prototype[Symbol.iterator] = function () {
    return Object.values(this)[Symbol.iterator]()
}

//对象没有迭代器，for of不能用于对象也是没有迭代器
var [a, b] = { a: 1, b: 2 }

console.log(a,b);

// arr[Symbol.iterator]迭代器
// 可通过next()就能读取到的对象