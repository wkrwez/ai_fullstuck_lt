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

    // 只能订阅一次
    once(type, cb) {
        if(this.event[type] && this.event[type].indexOf(cb) !== -1){
            return
        }
        this.on(type,cb)
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
        const handles = this.event[type]
        const index = handles && handles.indexOf(cb)
        if(index !== -1){
            handles.splice(index,1)
        }
    }

}




const emiter = new EventEmitter()

function foo(){
    console.log('去买房');
}

// emiter.on('sell',foo)
// emiter.emit('sell')

emiter.once('sell',foo)
emiter.once('sell',foo)
emiter.once('sell',foo)
emiter.emit('sell')




