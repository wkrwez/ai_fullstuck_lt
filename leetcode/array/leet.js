var nums = [1,1,2]

var removeDuplicates = function(nums){
   var res = []

   for(var i=0; i<nums.length;i++){
    if(!res.includes(nums[i])){
        res.push(nums[i])
    }
    
   }
   return res

}
console.log(removeDuplicates(nums));