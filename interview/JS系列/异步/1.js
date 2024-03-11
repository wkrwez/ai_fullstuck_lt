function a(){

    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('b');
            resolve();
        },2000);
    });
       
}

function b(){
    setTimeout(()=>{
        console.log('b');
        resolve();
    },2000);
}

function c(){
    console.log('c');
}

Promise.race([a(),c()]).then((res)=>{
    console.log(res);
    console.log('d');
});

// a().then(()=>{  //return Promise{}
//     console.log('a');
// }).catch((error)=>{
//     console.log(error);

// })
