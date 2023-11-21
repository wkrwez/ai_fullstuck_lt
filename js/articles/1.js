const nums = [9,2,3,6,7]
//排序 冒泡O(n*2)  快排O(nlogn)
// console.log(nums.sort());
// console.log(nums);
// 这个函数不单纯， 有副作用，不可靠的函数
function sortArr(arr) {
//    const res = arr 
//    return res.sort()    //同一个地址，引用式赋值，return res.sort()还是改变了原数组
    return arr.concat().sort()
}
console.log(sortArr(nums),nums);