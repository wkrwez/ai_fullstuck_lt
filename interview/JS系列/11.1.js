//隐式绑定
var name = 'Tom'
var obj={
    name: 'John',
    foo:foo()  //对象拥有函数
}
  function foo() {
    console.log(this.name);
  }

obj.foo


//隐式丢失