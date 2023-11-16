// function foo(){
//     console.log(this.a);
// }
// var obj = {                                                                 
//     a:1
// }
// // foo()  无法让this指向obj
// foo.call(obj)  //call()方法，显式绑定让this指向obj


function foo(x,y){
    console.log(this.a,x+y);
}
var obj = {
    a:1
}
// foo.call(obj,4,5)  //call会帮foo传参
//   foo.apply(obj,[4,5])  // 它接受参数是以数组形式传参
let bar =foo.bind(obj,4) 
bar(5)  //可以在bind里面传一个（另一个放在bar）或两个，优先使用bind里面的参数