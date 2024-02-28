// Object.prototype.abc = 123;

// let obj = { //new Object()   obj.__proto__ === Object.prototype
//     a:1,
//     b:2
// }

// console.log(obj.hasOwnProperty('abc'));  //判断对象上是否显示具有某个属性



let arr = [1,2,3,4,{n:5}]

// let newarr = [].concat(arr)

// arr[4].n = 6  //newarr 受影响

// let newarr = [...arr]

// arr[4].n = 6



console.log(newarr);
console.log(arr);