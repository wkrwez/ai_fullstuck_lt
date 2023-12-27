var threeSum = function(nums,target) {
    nums.sort((a,b)=>a-b);//方便去重结果
    const result = [];
    for(let i =0 ;i<nums.length-2;i++){
        if(i>0 && nums[i] ===nums[i-1]) continue; //跳过重复元素
        let left = i+1;
        let right = nums.length - 1
        while(left<right){
            const sum = nums[i] + nums[left] + nums[right];
            if(sum === target){
                result.push(nums[i],nums[left] , nums[right])
                //性能优化
                while(left<right&&nums[left]===nums[left+1]) left++;
                while(left<right&&nums[right]===nums[right+1]) right--;
                left++
                right--
            }else if(sum < target){
                left ++
            }else{
                right --
            }
        }
    }
    return result  
};