class Emitter{
    constructor(){
        this.event={

        }
    }
    on(type,fn){
        if(!this.event[type]){
            this.event[type] = [fn]
            // return
        }else{
            this.event[type].push(fn)
        }
    }
    emit(type,...args){
        if(!this.event[type]){
            return
        }else{
            this.event[type].forEach(cb=>{
                cb(...args)
            })
        }
    }
    off(type,fn){
        const handles = this.event[type]
        const index = handles&&handles.indexOf(fn)
        if(index !== -1){
            handles.splice(index,1)
        }
        // return
    }
    once(type,fn){
        if(this.event[type] && this.event[type].indexOf(fn)!==-1){
            return
        }
        this.on(type,fn)
    }
}

const emiter = new Emitter()

function foo(){
    console.log('去买房');
}

emiter.on('sell',foo)
emiter.on('sell',foo)
emiter.on('sell',foo)
emiter.off('sell',foo)
emiter.emit('sell')

// emiter.once('sell',foo)
// emiter.once('sell',foo)
// emiter.once('sell',foo)
// emiter.emit('sell')