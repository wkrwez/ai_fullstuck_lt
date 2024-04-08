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