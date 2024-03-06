var obj = {
  name: 'Tom'
}
function foo(x, y) {
  console.log(this.name, x + y);
  return 'hello'
}

Function.prototype.myBind = function() {
  // arguments[0]  [...arguments].slice(1)
  let obj = arguments[0]
  let args = [...arguments].slice(1)
  let that = this

  const back = function(...arg) {
    // 让 that 的指向指导 obj
    // back 有没有被new调用
    if (this instanceof back) {
      // 让new作用于that
      return new that(...args, ...arg)
    }

    return that.apply(obj, [...args, ...arg])
  }

  return back
}


let bar = foo.myBind(obj, 2)
console.log(new bar(4));