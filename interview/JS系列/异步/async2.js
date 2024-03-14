function request(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(num * 10)
      }, 1000);
    })
  }
  
  
  function* gen() {
    const num1 = yield request(1)
    const num2 = yield request(num1)
    const num3 = yield request(num2)
    return num3
  }
  // 模拟async
  function generatorToAsync(generatorFn) { // 把generatorFn变更成具有async功能的函数
    return function () { // 具有async功能的函数
      const gen = generatorFn()
  
      return new Promise((resolve, reject) => {
        
        function loop(key, arg) {
          let res = null
          res = gen[key](arg)  // gen.next(100) // {value: Promise{}, done: false}
          const { value, done } = res
          if (done) { // 递归出口
            return resolve(value)
          } else {
            Promise.resolve(value).then(val => loop('next', val)) // 10  Promise.resolve()接受一个promise对象为参数，会直接读取到该参数对象中resolve的值
          }
        }
        loop('next')
        
      })
    }
  }
  const asyncFn = generatorToAsync(gen)
  asyncFn().then(res => {
    console.log(res);
  })