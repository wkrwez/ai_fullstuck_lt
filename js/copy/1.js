
// let a= 1
// let b= a
// a=2
// console.log(b);//1


// 堆  存储引用类型，赋值地址
let a={
    age:18
}
let b=a

a={   //新的对象，所有地址不一样,前面a的地址会指向新对象，b地址不变  1.jpg
    age:20
}
console.log(a.age);  //18