// function foo(){
// }


// var foo = function(){}   //函数表达式



// //箭头函数
// var obj ={
//     a:1
// }
// var foo = () =>{      //箭头函数
//     console.log(this.a);
// }
// foo.call(obj)              //无法让this指向obj，因为箭头函数没有this，写了也是别人的


// var bar = function(){
//     console.log(this.a);
// }
// bar.call(obj)




//下面的this都是foo的
var obj ={
    a:1
}
function foo(){
    var bar = ()=>{
        console.log(this);
        var baz = ()=>{
            console.log(this);  
        }
        baz()
    }
    bar()
}
foo.call(obj)