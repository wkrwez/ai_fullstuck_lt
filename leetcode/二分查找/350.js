// 双指针
// var intersect = function(nums1, nums2) {
//     nums1.sort((a,b)=> a-b)
//     nums2.sort((a,b)=> a-b)
//     let sum = []
//     let j=0
//     for(let i = 0;i<nums1.length;i++){
//         let num = nums1[i]
//         while(j<nums2.length){
//             if(num <nums2[j]) break
//             if(num > nums2[j]){
//                 j++
//             }else if(num === nums2[j]){
//                 sum.push(num)
//                 j++
//                 break
//             }

//         }
//     }
//     return sum
// };


//哈希存储重复数
var intersect = function(nums1, nums2) {
    let map = {}
    let sum = []
    nums1.forEach(item=>{
        if(map[item]){
            map[item]++
        }else{
            map[item] = 1
        }
    })

    for(let i = 0;i<nums2.length;i++){
        let num = nums2[i]
        if(map[num]){
            sum.push(num)
            map[num]--
        }
    }
    
    return sum
};

let nums1 = [4,9,5], nums2 = [9,4,9,8,4]

intersect(nums1,nums2)


//二分查找
var intersect = function(nums1, nums2) {
    nums1.sort((a,b)=> a-b)
    nums2.sort((a,b)=> a-b)
    let left = 0
    
    let sum = []
    for(let i = 0;i< nums1.length;i++){
        let num = nums1[i]
        let right = nums2.length -1
        //二分查找
        while(left<=right){
            let midle = Math.ceil((left + right)/2) 
            if(nums2[midle] < num ){
                left = midle + 1
            }else if(nums2[midle] > num){
                right = midle -1
            }else if(nums2[midle] === num){
                let index = nums2.splice(midle,1)
                sum.push(index)
                
                break
            }

        }

    }
    
    return sum
};