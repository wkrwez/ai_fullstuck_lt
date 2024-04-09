// 第一次先将digits的第一项对应的字母存入队列，然后再出队和digits的下一项组合

// var letterCombinations = function(digits) {
//     const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
//     const queue = []
//     if(!digits.length)return queue
//     queue.push('')

//     for(let i =0;i< digits.length;i++){
//         let obj = map[digits[i]]
//         let length = queue.length
//         for(let j = 0;j<length;j++){
//             let n = queue.shift() //''
//             for(let p of obj){
//                 queue.push(n + p)

//             }
//         }
        
//     }
//     return queue


// };

//递归，第一层先拿到a后进去第二层，将a与第二层的d拼接去到第三层被return，依次类推
var letterCombinations = function(digits) {
    const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
    const res = []
    if(!digits.length)return res
    let s = ''
    function foo(digits,s,res,index,map){
        if(digits.length === index){
            res.push(s)
            return
        }
            let num = digits[index]
            let obj = map[num]

            for(let p of obj){
               foo(digits,s+p,res,index+1,map)
            }
        

    }
    foo(digits,s,res,0,map)
    console.log(res);
    return res
}











let digits = "23"

letterCombinations(digits)

