function a(){
    return new Promise((resolve,reject)=>{
        resolve('11')
        reject('22')
    })
}


a.then((res)=>{
    
})
.catch((err)=>{

})

function myPromise(fn){
    this.value = null
    this.reason = null
    const resolve = (value)=>{
        this.value = value
    }
}