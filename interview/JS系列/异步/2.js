class MyPromise {
    constructor(executor) {
      this.state = 'pending'  // promise的状态
      this.value = undefined // 接受resolve的参数
      this.reason = undefined // 接受reject的参数
      this.onFulfilledCallbacks = []
      this.onRejectedCallbacks = []
  
  
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled'
          this.value = value
          // 把then中的回调触发掉
          this.onFulfilledCallbacks.forEach(cb => cb(value))
        }
      }
  
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected'
          this.reason = reason
          this.onRejectedCallbacks.forEach(cb => cb(reason))
        }
      }
  
      executor(resolve, reject)
    }
  
    then(onFulfilled, onRejected) {
      // 把 onFulfilled 存起来，供resolve 调用
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
  
      // 返回一个promise
      const newPromise = new MyPromise((resolve, reject) => {
        if (this.state === 'fulfilled') { // then前面的promise对象状态是同步变更完成了
          setTimeout(() => { // 官方是微任务，我们宏任务简化一下
            try {
              const result = onFulfilled(this.value)
              resolve(result) // 应该放result里面的resolve中的参数
            } catch (error) {
              reject(error)
            }
          })
        }
  
        if (this.state === 'rejected') {
          setTimeout(() => {
            try {
              const result = onRejected(this.reason)
              resolve(result)
            } catch (error) {
              reject(error)
            }
          })
        }
  
        if (this.state === 'pending') { // 缓存then中的回调
          this.onFulfilledCallbacks.push((value) => {
            setTimeout(() => {  // 保障将来onFulfilled在resolve中被调用时是一个异步函数
              try {
                const result = onFulfilled(value)
                resolve(result)
              } catch (error) {
                reject(error)
              }
            })
          })
  
          this.onRejectedCallbacks.push((reason) => {
            setTimeout(() => {  // 保障将来onFulfilled在resolve中被调用时是一个异步函数
              try {
                const result = onRejected(reason)
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
//   多个异步任务，第一个成功调用then，第一个失败调用catch，
// 第一个失败，后面有成功的会继续调用then，全部失败就不调用then
    static race (promises) {
      return new MyPromise((resolve, reject) => {
        // 看promises里面的那个对象的状态先变更
        for (let promise of promises) {
          promise.then(
            (value) => {
              resolve(value)
            },
            (reason) => {
              reject(reason)
            }
          )
        }
        // resolve('')
      })
    }
//   等待所有异步改变状态，都是成功就改变为成功并执行then，
// 有一个失败，整个all都失败，执行catch
    static all (promises) {
      return new MyPromise((resolve, reject) => {
        let count = 0, arr = []
        for (let i = 0; i < promises.length; i++) {
          promises[i].then(
            (value) => {
              count++
              arr[i] = value
              if (count === promises.length) {
                resolve(arr)
              }
            },
            (reason) => {
              reject(reason)
            }
          )
        }
      }) 
    }
// 只要有一个 Promise 对象成功完成就then，所有的都失败就调用catch方法
    static any () {
      return new MyPromise((resolve, reject) => {
        let count = 0, errors = []
        for (let i = 0; i < promises.length; i++) {
          promises[i].then(
            (value) => {
              resolve(value)
            },
            (reason) => {
              count++
              errors[i] = reason
              if (count === promises.length) {
                reject(new AggregateError(errors))
              }
            }
          )
        }
      }) 
    }

    finally(callback) {
        return this.then(
            (value) => {
                return Promise.resolve(callback().then(() => value))
            },
            (res) => {
                return Promise.resolve(callback().then(() => res))
            }
        )
    }

    static allSettled(promises) {
        return new myPromise((resolve) => {
            let arr = []
            let count = 0;
            promises.forEach((promis, i) => {
                promis.then((value) => {
                    arr[i] = { status: 'fulfilled', value: value }

                }, (reason) => {
                    arr[i] = { status: 'rejected', reason: reason }

                })
            }).finally(() => {
                count++
                if (count == promises.length)
                    resolve(arr)
            })

        })
    }

    static resolve(value) {
        return new myPromise((resolve) => {
            resolve(value)
        })
    }
    static reject(reason) {
        return new myPromise((reject) => {
            reject(reason)
        })
    }

  }
  
  
  
  
  function a() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('a');
        resolve('a')
      }, 1000)
    })
  }
  function b() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('b');
        reject('b')
      }, 500)
    })
  }
  
  function c() {
    console.log('c');
  }
  
  MyPromise.all([a(), b()]).then((res) =>{
    console.log(res);
  })