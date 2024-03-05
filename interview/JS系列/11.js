// var name = 'Tom'
// var obj = {
//   name: 'John'
// }

// function foo() {
//   console.log(this.name);
// }

// function bar() {
//   var name = 'Jerry'
//   foo()
// }

// function baz() {
//   bar()
// }

// baz.call(obj)


// var name = 'Tom'
// var obj = {
//   name: 'John',
//   foo: foo
// }
// function foo() {
//   console.log(this.name);
// }
// obj.foo()





var name = 'Tom'
function bar() {
  var name = 'Jerry'
  function foo() {
    console.log(this.name);
  }
  foo()
}
bar()


// function baz() {
//   bar()
// }