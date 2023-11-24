//写一个浅拷贝函数
let obj={
   name:'刘涛',
   age:18,
   like:{
     n:'run'
   }
}
// let o =Object.create(obj)
// o.sex='boy'

function shalldowCopy(obj){
//不是引用类型就不拷贝
if(!(obj instanceof Object))return;//if(typeof obj!=='object'||obj ==null) return
//如果obj是数组，就创建数组，是对象就创建对象
    let objCopy=obj instanceof Array?[]:{}
for(let key in obj){
    if(obj.hasOwnProperty(key)){  
        objCopy[key]=obj[key]
    }
}
return objCopy
}

let newObj=shalldowCopy(obj)
console.log(newObj);