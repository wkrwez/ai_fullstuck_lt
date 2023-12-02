async function fn1() {
    await fn2()
    await fn3()
    console.log('fn1 end');
  }
  fn1()
  async function fn2() {
    console.log('fn2 end');
  }
  async function fn3() {
    console.log('fn3 end');
  }
  
  setTimeout(() => {
    new Promise((resolve) => {
      console.log('setTimeout');
      resolve()
    })
    .then(() => {
      console.log('then');
    })
    .then(() => {
      setTimeout(() => {
        console.log('then2 end');
      })
    })
    console.log('setTimeout end');
  }) 
//   fn2 end   fn3 end   fn1 end    setTimeout    setTimeout end   then   then2 end