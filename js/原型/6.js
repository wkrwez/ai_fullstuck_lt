function Foo(){}
    let foo = new Foo()


foo.__proto__ === Foo.prototype  //实例对象隐式原型等于构造函数显式原型
Foo.prototype.__proto__ === Object.prototype
Object.prototype.__proto__ ===null

console.log(foo.toString());//在 Object.prototype找到了3.png