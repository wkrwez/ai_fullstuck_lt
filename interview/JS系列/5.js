let obj = { 
    a:1,
    b:[1,2,[3,4]]
}


function shallowCopy(obj) {
    let newObj = {}
    for(let key in obj){
        if(obj.hasOwnProperty(key)){  //显示原型上面的属性不拷贝
            newObj[key] = obj[key]
        }
        
    }
    return newObj
}


// function deepCopy(obj){
//     let newArr = {}
//     for(let key in obj){
//         if(obj.hasOwnProperty(key)){
//             if(typeof obj[key]!=='object' || obj[key]===null){ //原始类型
//             newArr[key] = obj[key]
//         }else{
//             newArr[key] = deepCopy(obj[key])
//         }
//         }
        
//     }
//     return newArr
    
// }

let obj2 = shallowCopy(obj)

obj.b[2][0]=6

console.log(obj2);
// console.log(shallowCopy(obj));
