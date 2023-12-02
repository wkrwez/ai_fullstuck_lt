function xq(){
    return new Promise((resolve,reject)=>{
        
    setTimeout(()=>{
    console.log('李裕民相亲了');
    resolve('相亲成功')    //它开始调用 then开始执行  //他的内容在then里面传参接收
    },2000)
    })
   
}

function marry(){
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
        console.log('李裕民结婚了');
        resolve()
     },1000)
    })
   
    
}

function baby(){
    console.log('李裕民');
}

xq().then((res)=>{     //then执行后就调用marry()
    // console.log(res);
    marry()   
})
.then(()=>{
    baby()
})
