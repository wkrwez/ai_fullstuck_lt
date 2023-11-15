// var obj = {}
//  obj.a
//  console.log(obj.a);


// var num = 123
//  num.a = 'hello'
//  console.log(num.a);    //undefined,没有报错是为什么？

//包装类
var num = 123
//  var num = new Number(123);    //String()  Number()  Boolean()  Object()  Arry()  Date()  内部函数
 num.a = 'hello' 
//  delete num.a
  console.log(num*2);           // num变成了对象，但是它又可以乘法     ,那么 num.a = 'hello' 合情合理,可以拿到hello
  //没有报错是因为var num = 123解读成var num = new Number(123);但是num是一个原始值，会有一个delete删除num.a，所以打印undefined(访问对象不存在的属性时会打印undefined)



//考点  原始值身上能有属性和方法吗?没有，为什么还能见到原始值身上有属性和方法
// var arr =[1,2,3,4]
// arr.length = 2
// // console.log(arr);    //[1,2]

//  var str = 'abcd'     //字符串没有length属性,为什么会有4？下面fun会遍历s，有几个就多长
// str.length = 2
// // new String('abcd').length = 2  delet
// console.log(str.length);//能打印4，执行下面这个
// //上面length属于 new String('abcd').length，所有可以打印4
// // 构造函数天生有这个
// function String(s){
//     this.length = 0
// }