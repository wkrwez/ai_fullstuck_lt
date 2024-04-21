let a = 'ab'

// const validOaliond = (s) =>{
//     const arr = s.split('')
//     if(isTrue(arr)){
//         return true
//     }
    
//     for(let i =0;i<s.length;i++){
//         const newArr = [...arr]
//         newArr.splice(i,1)
//         if(isTrue(newArr)){
//             return true
//         }
//     }
//     return false
// }

// function isTrue(arr){
//    return arr.join('') === arr.reverse().join('')
// }
// console.log(validOaliond(a));

const validOaliond = (s) =>{
    let l = 0;
}

function isTrue(str){
    let left = 0
    let right = str.length - 1
    while(left < right){
        if(str[left]!==str[right]){
            left++
            if(str[left]!==str[right]&& left<right){
                left--
                right--
                if(str[left]!==str[right]&& left<right){
                    return false
                }    
            }
        }
        left++
        right--
    }
    return true
}

console.log(isTrue(a));