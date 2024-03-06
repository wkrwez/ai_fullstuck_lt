// function foo() {
//   let a = 1
//   let b = 2

//   function bar() {
//     console.log(this);
//     console.log(a);
//   }

//   return bar
// }

// let baz = foo()

// baz()



function fn() {
  let count = 0

  const foo = function () {
    count++
  }
  
  const bar = function() {
    count--
  }
  return {foo, bar}
}

let {foo, bar} = fn()

foo()
bar()
