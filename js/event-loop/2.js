console.log(1);

setTimeout(() => {
  console.log(2);
  new Promise((resolve) => {
    console.log(4);
    resolve()
    setTimeout(() => {
      console.log(6);
    }) 
  }).then(() => {
    console.log(5);
  })
}, 1000)

console.log(3);