var co = require('co');

function a() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('a 完成');
      resolve()
    }, 1000)
  })
  
}

function b() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('b 完成');
      resolve()
    }, 500)
  })
  
}

function* g() {
  yield a()
  yield b()
}

co(g)



// let gen = g()
// let result = gen.next()
// result.value.then((value) => {
//   gen.next()
// })


// function run(fn) {
//   let gen = fn()

//   function next(err, data) {
//     let result = gen.next(data)
//     if (result.done) return
//     result.value(next) // a()
//   }

//   next()
// }
// run(g)





