import {track,trigger} from '../effect.js'
import {reactive} from '../reactive.js'
export function ref(val){//将原始类型数据变成响应式  引用类型也可以
    return createRef(val)
}

function createRef(val){
    // 判断val是否已经是响应式
    
    if(val.__v_isRef){
        return val
    }

    // 将val变成响应式
    return new RefImpl(val)
}

class RefImpl{
    constructor(val){  //class类的语法
        //ref代理的对象身上的属性
        this.__v_isRef = true //给每一个被ref操作过的属性值添加标记
        this._value = convert(val)

    }

    get value(){ //age.value可以获取
        //为this对象做依赖收集
        track(this,'value')
        return this._value
    }
    //更新age
    set value(newVal){
        if(newVal !== this._value){
            this._value = convert(newVal)
            trigger(this,'value')//触发掉'value'上的所有副作用函数
        }
    }
}

function convert(val){
    if(typeof val!=='object' || val === null ){
        return val
    }else{
        return reactive(val)
    }

}