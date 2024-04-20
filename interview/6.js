// function foo(){
//     let a = 1
//     let b = 2

//     function bar(){
//         console.log(this.a);
//         console.log(a);
//     }

//     return bar
// }

// let baz = foo()

// baz()


//柯里化
// function add(a,b,c){
//     return a+b+c
// }

// function add(a){
//     return function(b){
//         return function(c){
//             return a+b+c
//         }
//     }
// }

// add(1)(2)(3)

// const str = "Hello world";

// console.log(str.endsWith("world", 5)); // 输出: true
// console.log(str.endsWith("world", 5));  // 输出: false

// let arr = [1,2,3]
// let res = arr.forEach((item) =>{
//     return item*2
// })
// console.log(arr);

let arr = [1,2,3]
let res = arr.map((item) =>{
    return item*2
})
console.log(res);