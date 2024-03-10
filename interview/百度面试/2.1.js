
function red(){
    console.log('红灯亮了')
}
function green(){
    console.log('绿灯亮了')
}
function yellow(){
    console.log('黄灯亮了')
}








function light(cb,time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            cb()
            resolve()
        },time)
    })
}

function lightSetp(){
    Promise.resolve().then(()=>{
        return light(red,1000)
    }).then(()=>{
        return light(green,2000)
    }).then(()=>{
        return light(yellow,3000)
    }).finally(()=>{
        lightSetp()
    })
}
lightSetp()