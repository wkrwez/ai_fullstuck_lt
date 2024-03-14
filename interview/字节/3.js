
// let arr = [1,2,2,3,3,4,5,4]

// let newArr = [...new Set(arr)]//原始类型数组去重
// console.log(newArr);

let arr = [1, 2, 3, 2,
    { name: '张三', id: 1 },
    { name: '张三', id: 2 },
    { name: '张三', id: 1 }
]

// let arr2 = arr.map((item)=>{
//     return JSON.stringify(item)

// })

// let newArr = [...new Set(arr2)]

// newArr = Array.from(newArr).map((item)=>{
//     return JSON.parse(item)
// })
// console.log(newArr);



function unique(arr) {
let res = []
    for (let item of arr) {
        let isFind = false
        for (let resItem of res)
            if (equal(item, resItem)) {
                isFind = true
                break;
            }
        if (!isFind) {
            res.push(item)
        }
    }
    return res
}
// 判断两个对象是否一样
function equal(v1, v2) {
    if ((typeof v1 === 'object' && v1 !== null) && (typeof v2 === 'object' && v2 !== null)) {//都是引用类型
        // key数量不一样
        if(Object.keys(v1).length !== Object.keys(v2).length){
            return false
        }
        for (let key in v1) {
            if (v2.hasOwnProperty(key)) {
                if(!equal(v1[key], v2[key])){
                    return false
                }
            } else {
                return false
            }
        }
        return true
    } else {
        return v1 === v2
    }
}

console.log(unique(arr));