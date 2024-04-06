const list = [
    {
        id: 1001,
        parentId: 0,
        name: "AA",
    },
    {
        id: 1002,
        parentId: 1001,
        name: "BB",
    },
    {
        id: 1003,
        parentId: 1001,
        name: "CC",
    },
    {
        id: 1004,
        parentId: 1003,
        name: "DD",
    },
    {
        id: 1005,
        parentId: 1003,
        name: "EE",
    },
    {
        id: 1006,
        parentId: 1002,
        name: "FF",
    },
    {
        id: 1007,
        parentId: 1002,
        name: "GG",
    },
    {
        id: 1008,
        parentId: 1004,
        name: "HH",
    },
    {
        id: 1009,
        parentId: 1005,
        name: "II",
    },
];

// 新手在上班后会遇到的编程题
// 树状列表  文件夹    省市区联动
// 列表？数据库，后端查出来的所有项  select*from list;
// 后端不会给你转型 树状列表等是前端需求
// parentId  树


// 时间复杂度O(n^2) 优化   暴力破解 hashMap    空间换时间
function listTree(data) {
    const res = []
    data.forEach(item => {
        const parent = data.find(node => node.id === item.parentId)
        if (parent) {
            parent.children = parent.children || []
            parent.children.push(item)
        } else {
            res.push(item)
        }
    })
    return res
}

// console.log(listTree(list));


// // 哈希
function listTree(data) {
    const obj = {}
    data.forEach(item=>{
        obj[item.id] = item

    })
    const res = []
    data.forEach(item=>{
        const parent = obj[item.parentId]
        if(parent){
            parent.children = parent.children || []
            parent.children.push(item)
        }else{
            res.push(item)
        }
    })
    return res

    // const map = new Map()
    // data.forEach(item=>{
    //         map.set(item.id,item)
    
    //     })
    // const res = []
    // data.forEach(item => {
    //     const parent = map.get(item.parentId)
    //     if (parent) {
    //         parent.children = parent.children || []
    //         parent.children.push(item)
    //     } else {
    //         res.push(item)
    //     }
    // })
    // return res

}
// console.log(listTree(list));

// console.time();




function listTree(data){
    let obj = {}
    data.forEach(item=>{
        obj[item.id] = item
    })
    const res = []
    data.forEach(node=>{
        const parent = obj[node.parentId]
        if(parent){
            parent.children = parent.children || []
            parent.children.push(node)
        }else{
            res.push(node)
        }
    })
    return res
}
console.log(listTree(list));