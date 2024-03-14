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
  let g = gen()
  console.log(g.next());
  console.log(g.next(10));
  console.log(g.next(100));
  console.log(g.next(1000));
  
  // next1.value.then(res1 => {
  //   console.log(res1);
  
  //   const next2 = g.next(res1)
  //   next2.value.then(res2 => {
  //     console.log(res2);
  
  //     const next3 = g.next(res2)
  //     next3.value.then(res3 => {
  //       console.log(res3);
  //     })
  
  //   })
  // })
  
  
  
  
  // request(1).then(res1 => {
  //   console.log(res1);
  //   request(res1).then(res2 => {
  //     console.log(res2);
  //   })
  // })
  
  
  
  // async function fn() {
  //   const res1 = await request(1)
  //   const res2 = await request(res1)
  //   const res3 = await request(res2)
  //   console.log(res3);
  // }
  // fn()