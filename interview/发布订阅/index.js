class EventEmitter {
    constructor() {
        this.event = {

        }
    }
    // 订阅
    on(type, cb) {
        if (!this.event[type]) {
            this.event[type] = [cb]
            return
        }
        else {
            this.event[type].push(cb)
        }
    }

    // 发布订阅，删除
    once(type, cb) {
        let fn = () => {
            cb()
            this.off(type, fn)
        }
        this.on(type, fn) //先存起来，只要发布就调用fn再删除
    }
    // 发布
    emit(type, ...args) {
        if (!this.event[type]) {
            return
        }
        else {
            this.event[type].forEach(cb => {
                cb(...args)
            })
        }
    }
    // 删除
    off(type, cb) {
        if (!this.event[type]) {
            return
        }
        else {
            this.event[type] = this.event[type].filter(item => item !== cb)
        }
    }

}

let ev = new EventEmitter()

const func = (str) => {
    console.log(str);
}



// ev.on('say', func)
ev.once('say', func)
// ev.emit('say', 'visa')
// ev.off('say', func);


