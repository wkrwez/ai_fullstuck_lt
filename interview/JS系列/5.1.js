// // Object.prototype.abc = 123

// // let obj = {  // new Object()   obj.__proto__ == Object.prototype
// //   a: 1,
// //   b: 2
// // }

// // // for (let key in obj) {
// // //   console.log(key, obj[key]);
// // // }

// // console.log(obj.hasOwnProperty('abc'));  // 判断对象上是否显示具有某个属性




// let obj = {
//   a: 1,
//   b: {
//     n: 2
//   }
// }


// // let newObj = Object.assign({}, obj)
// // let newObj = Object.create(obj)  // newObj.__proto__ = obj
// // obj.b.n = 3

// console.log(newObj.a);


let arr = [1, 2, 3, {n: 4}]

// let newArr = [].concat(arr)
// let newArr = arr.slice(0, arr.length)
let newArr = [...arr]


arr[3].n = 5

console.log(newArr);