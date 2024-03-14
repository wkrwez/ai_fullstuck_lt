function a() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('a');
        // reject('no')
        resolve('ok')
        
      }, 1000)
    })
    
  }
  
  function b() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('b');
        resolve('yes')
      }, 500)
    });
  }
  
  Promise.race([a(), b()]).then((res) => {
    console.log(res);
  })
  
  
  // b()
  
  

function c(){
    console.log('c');
}

// Promise.race([a(),c()]).then((res)=>{
//     console.log(res);
//     console.log('d');
// });

// a().then(()=>{  //return Promise{}
//     console.log('a');
// }).catch((error)=>{
//     console.log(error);

// })


// Promise.all([a(),b()]).then((res)=>{
//     console.log(res);
// }).catch((error)=>{
//     console.log(error);
// })