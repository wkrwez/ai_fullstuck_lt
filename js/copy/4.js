// //深拷贝
let obj ={
    name:'李总',
    age:18,
    a:{
        n:1
    },
    b:undefined,
    c:null,
    d:Symbol(123),
    e:function(){},
    f:{
        n:100
    }

}
// obj.e=obj.f
// obj.f.n=obj.e//循环引用
// console.log(obj);


// console.log(JSON.stringify(obj));//把对象转换成字符串，花括号也转换成字符串
// let str = JSON.stringify(obj)

// console.log(JSON.parse(str));

// let obj2 =JSON.parse(JSON.stringify(obj))  //深拷贝  但是需要注意
// obj.age=20
// obj.age.n=10
// console.log(obj2);




// 深拷贝的手写实现  循环引用也无法处理  Loadsh


function deepCopy(obj) {
    let objCopy = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 区分 obj[key] 原始类型和引用类型
        if (obj[key] instanceof Object) { // 不能直接赋值
          objCopy[key] = deepCopy(obj[key]);
        } else {
          objCopy[key] = obj[key]
        }
  
      }
    }
  
    return objCopy
  }
  
  let obj2 = deepCopy(obj);
  obj.a.n = 11
  console.log(obj2);

//遇到对象里的对象就执行递归，遍历里面对象的属性，遍历完回去
