
//这个方法可以查询一个二维数组是否存在一个数组
let arr = [
    [1, 1, 2],
    [1, 2, 1],
    [2, 1, 1]
  ];
  
  let targetArray = [1, 1, 2]; // 要查找的目标数组
  
  let exists = arr.some(subArray => {
    return subArray.every((value, index) => value === targetArray[index]);
  });
  
  console.log(exists); // 输出 true，因为目标数组存在于二维数组中
  



[1,1,2]
//第一层生成一个set放入了1,第一个1的排列全部结束轮到第二个1
//因为第一层的1在set，所有第二个1直接退出循环
  var permuteUnique = function(nums) {
    let arr = []
    let map = {}
    
    function back(res){
        if(res.length === nums.length ){
            arr.push(res.slice())      
            return
            
        }
        let set = new Set()

        for(let i = 0;i < nums.length;i++){
            let num = nums[i]
            if(map[i] || set.has(num)) continue
            set.add(num)
            res.push(num)
            map[i] = true
            back(res)
            res.pop()
            map[i] = false
        }
    }
    back([])

    return arr
};
