# 二分查找
找到有序数组满足target的下标
    通过数组的中间值判断target是否存在，存在midle哪一边

# 左闭右闭
[left,right]     [1,1]   <=

right = numsize - 1
while(left<=right){
    midle = (left + right)/2
    if(num[midle] > target){
        right = midle - 1 // 这个midle已经大于target就没必要加入下一个区间
    }else if(num[midle] < target){
        left = midle + 1
    }
}

# 左闭右开
[left,right)    [1,1)无意义   <   可见left和right不能相等

right = numsize
因为right不包含midle，所以
right = midle
left = midle + 1