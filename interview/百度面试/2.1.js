function red(){
    console.log('红灯亮了');
}
function green(){
    console.log('绿灯亮了');
}
function yellow(){
    console.log('黄灯亮了');
}

function light(fn,time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            fn()
            resolve()
        },time)
    })
}

// return 是为了将所有promise对象链接起来
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