var arr = ['a','b','c','d']
/* arr.forEach(function(item参数,index下标,arr){    //把每一个数组元素遍历一下
    arr[index] = item + '1'                         //每个数组元素加1
}) */

var newArry = arr.map(function(item,index,arr){
    return item +'1'
})
console.log(newArry);