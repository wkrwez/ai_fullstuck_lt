let obj = { 
    a:1,
    b:{
        n:1
    },
    undefined,
    Symbol,
    function(){},
    
}
let newObj = structuredClone(obj)
console.log(newObj);

// let arr = [1,2,3,{n:1}]

// let newObj = [...arr]
// arr[3].n = 2
// console.log(newObj)


// function shallowCopy(obj) {
//     let newObj = {}
//     for(let key in obj){
//         if(obj.hasOwnProperty(key)){  //显示原型上面的属性不拷贝
//             newObj[key] = obj[key]
//         }
        
//     }
//     return newObj
// }




// function deepCopy(obj){
//     let newObj = {}
//     for(let key in obj){
//         if(obj.hasOwnProperty(key)){
//             if(typeof obj[key] !== 'object' || obj[key] === null){
//                 newObj[key] = obj[key]
//             }else{
//                 newObj[key] = deepCopy(obj[key])
//             }    
//         }
//     }
//     return newObj
// }

// let obj2 = deepCopy(obj)

// obj.b[2][0]=6

// console.log(obj2);
// console.log(shallowCopy(obj));
