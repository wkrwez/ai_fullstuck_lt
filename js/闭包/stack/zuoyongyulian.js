//函数声明在哪里，它的外层作用域就在哪里
function bar(){
    console.log(myName); //万总
}


function foo(){
    var myName = '涛哥'
    bar()
}

var myName='万总'

foo()                     