//大厂考点
var arr = [1,[2,[3,4]]]  //arr只有两个元素叫多维数组
//如何把一个数组扁平化(变成一维)[1,2,3,4]
// for(var i=0 ;i<arr.length;i++){
//     let res=[]
//     if(!Array.isArray(arr[i])){//判断一个值是不是数组
//          res.push(arr[i])
//     }else{//是数组
//         let item = arr[i]
//         for(var j=0 ;i<item.length;j++){
//             if(!Array.isArray(item[j])){//判断一个值是不是数组
//                 res.push(item[j])
//            }else{

//            }
//         }
//     }
// }
//如果用for循环在不知道数组维度的情况下会很麻烦


//但是大厂不让用
//用这个不知道数组是几维
// var newArr = arr.flat(2)  //将数组扁平化，扁平化2次       Infinity无穷大，用这个不论几维数组都会变成一维
// console.log(newArr);

//  let res= []  //放全局是不让他每调用一次就创建新的res[],但是无法和人合作完成代码，怕全局变量冲突
function flaten(arr){
    let res= []
   for(let i= 0;i<arr.length;i++){
    
    if(Array.isArray(arr[i])){
     let newArr= flaten(arr[i])  //递归   一个函数栈堆了很多函数执行，条件结束后要回去执行堆起来的函数
     res=res.concat(newArr)//在执行上面递归时这段代码不会执行，每次都会创建一个新的res回来的时候把数组拼接起来
    }else{
        res.push(arr[i])
    }
   }
   return res
}
flaten(arr)
console.log(flaten(arr));