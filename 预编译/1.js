// function fn(a) {
//     console.log(a); // 
//     var a = 123
//     console.log(a); // 
//     function a() {}
//     console.log(a);  // 
//     var b = function() {}  //函数表达式  变量声明
//     console.log(b);  // 
//     function d() {}
//     var d = a
//     console.log(d);  // 
//   }
//   fn(1)



// function foo(a,b){
//     console.log(a);//1
//     c=0
//     var c;
//     a=3
//     b=2
//     console.log(b);//2
//     function b(){}
//     function d(){}
//     console.log(b);  //2
// }
// foo(1)


// AO ={
//     a:undefined    1                   3,
//     b:undefined    function b(){}      2,
//     c:undefined                        0,
//     d:             function d(){}
// }

