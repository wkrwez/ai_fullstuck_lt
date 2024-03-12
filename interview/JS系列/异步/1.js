function a(){

    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('a');
            resolve();
        },2000);
    });
       
}

function b(){
    return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log('b');
        reject('错误');
    },2000);
})
}

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