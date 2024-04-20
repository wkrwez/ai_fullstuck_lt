function red(){
    console.log('红灯');
}
function green(){
    console.log('绿灯');
}
function yellow(){
    console.log('黄灯');
}


function light(fn,time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            fn()
            resolve()
        },time)
    })
}

function lightSetup(){
    Promise.resolve().then(()=>{
        return light(red,1000)
    })
    .then(()=>{
        return light(green,1000)
    })
    .then(()=>{
        return light(yellow,1000)
    })
    .finally(()=>{
        return lightSetup()
    })
}

lightSetup()