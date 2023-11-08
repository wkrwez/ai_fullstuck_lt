// var str = 'hello world'//string 字符串
// var num = 123 // number 数字 
// var flag = false // boolean 布尔
// var un = undefined //
// var n = null

// // 引用类型  对象
// var obj = {
//     name: '洋洋',
//     age: 18,
//     like:{
//         item1:'eat'
//     }
// }

// console.log(obj.name)

// var arr = ['a','b',2,'d']

// arr[5] = true
//arr.push(true) //在数组的最后增加参数
//arr.pop() //移除数组最后一位，不用传参
// arr.unshift('hello') //在数组头部增加参数
// arr.shift() //删除数组头部参数

// arr.splice(2,1) //删除任意一个数组元素  （下标，删几个）
// arr.splice(2,0,false)//从下标2开始删除0个，增加一个false

// for(var i=0;i<arr.length;i++){
//     arr[i]=arr[i]+1;
// }


// arr.forEach(function(item, index, arr){  //回调
                     
//      arr[index] = item + 1 
// })



// var arr = new Array(4).fill(1)//四个位置，全部填充1

// console.log(arr);


// var arr =[
//     [1,2,3,4,5],
//     [1,2,3,4,5],
//     [1,2,3,4,5],
//     [1,2,3,4,5],
//     [1,2,3,4,5],
// ]

// for(var i = 0;i < arr.length; i++){
//     for(var j=0;j<arr[i].length;j++){
//         arr[i][j] = arr[i][j] * 10
//     }
// }

// console.log(arr);
// console.log(arr[1][3]);


var arr =[1,2,3,4]
 arr.splice(1,1)
console.log(arr.splice(1,2));


