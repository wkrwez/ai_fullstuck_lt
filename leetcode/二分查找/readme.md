# 二分查找

找到有序数组满足 target 的下标
通过数组的中间值判断 target 是否存在，存在 midle 哪一边

# 左闭右闭

[left,right] [1,1] left<=right

right = num.length - 1
while(left<=right){
midle = (left + right)/2
if(num[midle] > target){
right = midle - 1 // 这个 midle 已经大于 target 就没必要加入下一个区间
}else if(num[midle] < target){
left = midle + 1
}
}

# 左闭右开

[left,right) [1,1)无意义 < 可见 left 和 right 不能相等

right = numsize
因为 right 不包含 midle，所以
right = midle
left = midle + 1
