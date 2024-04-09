

const permute = (nums) => {
    let arr = []    
    let map = {}    //记录每层的数字是否使用过

    function back(res){
        
        if(res.length === nums.length){
            arr.push(res.slice())
            return
        }
        for(let i = 0;i<nums.length;i++){
            let num = nums[i]
            if(map[num])continue  //为true就是使用过
            res.push(num)
            map[num] = true
            back(res)  
            //把1，2，3都放进res后，在每一层去掉res的一个数，在第二层将2删除后又进入循环，
            //此时3已经被改为false，所有3进入res，直到第二三层循环走完再将res置空。
            res.pop()
            map[num] = false        
        }
    }
    back([])
    return arr
};

let nums = [1,2,3]
permute(nums)