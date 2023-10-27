# 作用域  
  - js 是弱类型动态语言   
    `var a=1
    a='Hello'`
   这段代码会输出Hello，如果是强类型的语言则这段代码的类型会提示错误
  - 执行代码前是需要先编译的
   <img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98573960c1f54a629170caae5659c954~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=468&s=83741&e=png&b=ffffff" >

# 编译
  1.找到某个域当中的有效标识符


# 执行
  1.变量的查找会先从内到外的作用域中查找，不能从外到内
  var a=1
  function foo(){
    var a=2
    console.log(a)
  }
   foo()

执行结果为：2



# 全局作用域
编译器从内到外执行代码，在全局视角下编译器只能编译处于全局作用域的代码片段
var a=1
function foo(){
   var a=2
    
}
foo()
console.log(a)

执行结果为：1

 
# 函数体作用域
在函数体作用域内代码的编译照样从内到外。
如下编译器在函数体作用域查找不到变量会去外层函数体作用域查找变量：
var a=1
function foo(){
   var a=2
    function bar(){
        console.log(a)
    }
    bar()
}
foo()

执行结果为：3


# 块级作用域
  - var 声明的变量存在声明提升，提升到当前作用域的顶端
  console.log(a);
  var a=1
  vscode编译器会提示undefined，因为
  var a//声明提升
  console.log(a);
  a=1
  - 函数声明会整体提升
  执行函数在函数体前面依旧可以成功执行出结果
foo()
function foo(){
    console.log(123)
}

执行结果：123
  - {}+let或const 会形成块级作用域
  if(1){
    var a=1
}
console.log(a);

执行结果：1
如果将var换成let或者const将会形成块级作用域，声明的变量无法声明提升，编译器将会报错。

- 暂时性死区
 let a = 1
 if(true){
  console.log(a);
  let a = 2
 }

 这段代码编译器会报错，形成一个暂时性死区



# let
 - 不会声明提升

console.log(a);
 let a=1;

 该代码不能实现var的声明提升，编译器会报错

 - 不能重复声明同一变量
 let a=1;
let a=2;
console.log(a);

编译器会报错


 # const
  - 不会声明提升
  console.log(a);
  const a=1;

  const和let一样无法实现声明提升

  - 不能重复声明同一变量
  const a=1;
  const a=2;
  console.log(a);
  编译器会报错

  - 声明的变量值不能被修改
  const a = 1
  a='hello'
  console.log(a);

  执行结果：1



# 欺骗词法作用域
  - eval() 让原本不属于这里的代码变成就是写在这里的

  function foo(str){
    eval(str)
    var a = 1
    console.log(a,b);
}
foo('var b = 2')


  - with() 当修改对象中不存在的属性时，该属性会泄露到全局成为全局变量
function foo(obj){
    with(obj){
        a=2
    }
}
var o1={
    a:3
}
var o2={
    b:4
}
foo(o2)
console.log(a)

执行结果：2

  - 不带关键字的变量声明会成为全局变量
  function foo(){
     c=3
}
foo()
console.log(c);
 相反，要是对c进行声明，编译器将会报错，因为c声明后将会是函数体作用域的变量