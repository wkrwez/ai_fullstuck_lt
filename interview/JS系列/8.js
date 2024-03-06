// for (let i = 0; i< 10; i++) {
//   let a = 1234
// }

// console.log(a);



var obj = {
  a: 1,
  foo: foo
}

function foo() {
  console.log(this.a);
}

obj.foo()