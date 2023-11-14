//原始类型
/* let num = 123
let str = "hello"
let flag=true
let un = undefined
let nu = null */
//引用类型  非常大
/* let obj = {}
let fn = function(){}
let arr = []
let date = new Date() */



/* let a = 1
let b = a
a = 2
console.log(b); */
//1.jpg




 /*  编译后先把对象{}赋给a，但是所有的引用类型都不能放进调用栈，
（因为它可能非常大会爆栈。如果调用栈很大并且放了很多函数，
函数就会执行很慢（口袋里面放了很多东西就不好找要用的东西））。
所有v8引擎会创建一个“堆”，（它内存非常大，取决于自己的计算机的性能）.
把引用类型{}存入堆，赋予一个引用地址并把地址1010赋给a
 */
//2.jpg
let a={
    age:18
}
let b = a     /* a赋给b其实就是把a的地址赋给b */
 a.age = 20   /* 找到a的地址并赋值20 */
console.log(b.age);  //20