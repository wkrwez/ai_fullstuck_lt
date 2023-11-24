// let a={
//     name:'雨程',
//     like:{
//         n:'coding'
//     }
// }
// let b=Object.create(a)
// a.name ='涛'
// console.log(b.name);//涛


// let b =Object.assign({},a)  //拷贝了a的like的地址
// a.like.n='run'
// console.log(b.like);  //'run'



let arr=[1,2,3,{n:10}]
// let newArr=[].concat(arr)
// arr[3].n=100
// console.log(newArr);  //[ 1, 2, 3, { n: 100 } 数组里面原始值无法改变，对象会被改变浅拷贝


//解构
// let newArr=[...arr]
// arr[3].n=100
//  console.log(newArr);//浅拷贝
let newArr=arr.toReversed