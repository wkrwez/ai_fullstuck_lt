
//说明this的指向
// var a = 1
// function foo(){
//     console.log(this.a);   //this代表foo，指向全局,
// }
// foo()



//
// var a = 1
//  function foo(){
//      console.log(this.a);  
//  }

// function bar(){  //bar 的词法作用域是window
//     var a = 2    
//     foo()     //foo()在bar的作用域生效，但是此时必须要知道bar的词法作用域是谁
 
// }
// bar()






function foo(){
    
    function bar(){
        console.log(this);  //this指向window   ，bar在foo里面调用，foo的词法环境是window
    }
    bar()      
}
foo()




function foo(){    //[[scope]]这个属性描述作用域
    
    function bar(){
        console.log(this);  //this指向window   ，bar在foo里面调用，foo的词法环境是window
    }
    function baz(){
        bar() //独立调用
    }
    baz()      
}
foo()