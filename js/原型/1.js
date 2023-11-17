
Person.prototype.say = function(){//prototype   函数自带的属性，函数原型,不会添加到Person
   console.log('jxb 真好吃');
}
function Person(){
   this.name = '冷少'// this是一个对象
   this.age = 18
}
Person.eat= function(){
    console.log('eating jxb');
}

let p = new Person()  //实例对象显式的继承了构造函数添加到this上的属性，隐式的继承函数原型上的属性和方法
let p2 = new Person()
// console.log(p);
 Person.eat();
p.eat() //无法调用  上面附在this上，eat附在eat()上,但是say可以通过p访问到
p.say()//打印console.log(p);里面没有say，但是可以用p来调用
console.log(p);