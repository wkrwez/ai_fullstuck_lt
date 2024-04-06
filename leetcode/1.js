// function foo(pstr,cstr){
//     let num = 0
//     let x = 0

//     for(let i = 0;i<pstr.length;i++){
//         if(pstr[i] == cstr[num]){
//             x = i
//            for(let j = 1;j<cstr.length;j++){
//             if(pstr[i+j] !== cstr[j])
//                 x = 0
//                 break
              
//            }
            
//         }
//         if(i === pstr.length -1 && x ==0){
//             return -1
//         }
        
//     }
//     return x 
// }



let s = 'abbc'
let p = 'bc'
console.log(foo(s,p));