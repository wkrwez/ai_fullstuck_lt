// var obj = {
//     a :1
// }
// function foo(){
//     console.log(this.a);   
// }
// foo()



// function foo(){
//     console.log(this.a); 
// }
// var obj = {
//     a :1,
//     foo:foo  //引用foo函数，所以this指向obj
// }
// obj.foo()   


//

function foo(){
    console.log(this.a); 
}
var obj = {
    a :1,
    foo:foo  //引用foo函数，所以this指向obj
}
var obj2 = {
    a:2,
    obj:obj
} 
obj2.obj.foo()   