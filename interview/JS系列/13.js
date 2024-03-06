let age = Symbol('key')
var obj = {
  name: 'Tom',
  [age]: 123
}
function foo(x, y) {
  console.log(this.name, x + y);
  return 'hello'
}
// let res = foo.apply(null, [1, 2])
// console.log(res);


Function.prototype.myCall = function() {
  // 让obj调用foo触发隐式绑定
  //  this  arguments[0]   [...arguments].slice(1)
  let obj = arguments[0] ? arguments[0] : window
  let args = [...arguments].slice(1)
  let key = Symbol('key')
  obj[key] = this
  let res = obj[key](...args)  // 隐式绑定
  delete obj[key]
  return res
}
foo.myCall(obj, 1, 2); 
console.log(obj);
