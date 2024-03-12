class myPromise {
    constructor(executor) {
        this.status = 'pending' //pending,fulfilled,rejected
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallback = []  //then的回调
        this.onRejectedCallback = []   //reject的回调
        const resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled'
                this.value = value
                this.onFulfilledCallback.forEach(fn => {
                    fn(this.value)
                })
            }
        }
        const reject = (value) => {
            if (this.status === 'pending') {
                this.status = 'rejected'
                this.reason = value
                this.onRejectedCallback.forEach(fn => {
                    fn(this.reason)
                })
            }
        }
        executor(resolve, reject)
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

        const newPromise = new myPromise((resolve, reject) => {
            // 考虑onFulfilled,onRejected
            if (this.status === 'fulfilled') {//then前面的对象状态已经变更完成
                setTimeout(() => { //模拟异步，但是模拟不了微任务
                    try {
                        const result = onFulfilled(this.value)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })

            }

            if (this.status === 'rejected') {
                setTimeout(() => { //模拟异步，但是模拟不了微任务
                    try {
                        const result = onRejected(this.value)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })

            }

            if (this.status === 'pending') {
                this.onFulfilledCallback.push((value) => {
                    setTimeout(() => {
                        try {

                        } catch (error) {
                            error
                        }
                    })
                })
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const result = onRejected(this.value)
                            resolve(result)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
            }
        })
        return newPromise
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }
    //接收一个数组，数组中的promise对象谁先发生状态变更，race就跟着变更状态
    static race(promise) {
        return new myPromise((resolve, reject) => {
            promise.forEach(promise => {
                //promise的状态是不是fulfilled？看看谁先
                promise.then((value) => {
                    resolve(value)
                },
                    (reason) => {
                        reject(reason)
                    }
                )

            })
        })
    }

    static all(promises) {
        return new myPromise((resolve, reject) => {
            let count = 0
            let res = []
            //判断数组所有的promise状态是否都为fulfilled
            promises.forEach((promise, i) => {
                promise.then((value) => {
                    count++
                    res[i] = value
                    if (count === promises.length) {
                        resolve(res)
                    }

                },
                    (reason) => {
                        reject(reason)
                    }

                )
            })

        })
    }

    static any(promises) {
        return new myPromise((resolve, reject) => {
            let count = 0
            let res = []
            //判断数组所有的promise状态是否都为fulfilled
            promises.forEach((promise, i) => {
                promise.then((value) => {
                    resolve(value)

                },
                    (reason) => {
                        count++
                        res[i] = reason
                        if (count === promises.length) {
                            reject(res)
                        }
                    }
                )
            })

        })
    }

    finally(callback){
        return this.then(()=>{
            (value)=>{
                return Promise.resolve(callback()).then(()=>value)
            },
            (reason)=>{
                return Promise.resolve(callback()).then(()=>reason)
            }
        })
    }

    static allSettled(promises) {
        return new myPromise((resolve, reject) => {
            let arr = []
            let count = 0;
            promises.forEach((promise,i)=>[
                promise.then(
                (value)=>{
                    arr[i] = {status:'fulfilled',value:value}
                },
                (reason)=>{
                    arr[i] = {status:'rejected',reason:reason}
                }
                ).finally(()=>{//所有promise状态都变更了
                    count++
                    if(count === promises.length){
                        resolve(arr)
                    }
                    
                })
            ])
            resolve()
        })
    
    }

    static resolve(){
        return new myPromise((value)=>{
            resolve(value)
        }) 
    }
    static reject(){
        return new myPromise((reason)=>{
            resolve(reason)
        }) 
    }

    
}



function a() {
    return new myPromise((resolve, reject) => {
        setTimeout(() => {
            console.log('a');
            resolve('123');
        }, 1000);
    });

}

function b() {
    return new myPromise((resolve, reject) => {
        setTimeout(() => {
            console.log('b');
            resolve('错误');
        }, 2000);
    })
}

function c() {
    console.log('c');
}


myPromise.all([a(), b()]).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})

