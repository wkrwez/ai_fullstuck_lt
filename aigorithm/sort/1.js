//冒泡排序
function bubbleSort(arr){
    let len = arr.length;  //缓存数组长度
    for(let i = 0; i < len; i++) {
         //len - i - 1是因为9在第一轮已经排好了，第二轮排好了8
        for(let j = 0; j < len - i - 1; j++) {
            //本轮的最大值到最右边
        if(arr[j] > arr[j+1]) {   // 相邻元素交换位置
            [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
        }
        }
    }
    return arr

}
//待排   从小到大排
const arr = [5,8,6,3,9,2,1,7]
bubbleSort()