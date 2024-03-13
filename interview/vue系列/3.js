function observer(){
    new Observer(observer)
}

//劫持监听,把数据变为响应式
class Observer{
    constructor(value){
        this.value = value
        this.walk(this.value)

    }
    walk(obj){
        Object.keys(obj).forEach(()=>{ //把对象的key拿到并形成一个数组
            defineReactive(obj,key, obj[key])
        })
    }


}


function defineReactive(obj,key,val){
    const dep = new Dep() // 依赖收集
    obj.defineProperty(obj,key,{
        get(){
            dep.addDep(Dep.target) //收集用了key的函数
            return val
        },
        set(newVal){
            if(newVal === val) return
            //修改obj.key的值
            //触发依赖
            dep.notify() //通知watcher触发依赖
        }
    })
}


//----------------------------
//解析指令
class Complier{
    constructor(el,vm){
        this.$vm = vm
        this.$el = document.querySelector(el) //获取到 #app
        if(this.$el){
            this.complier(this.$el)

        }

    }
    complier(el){
        const childNodes = el.childNodes //获取到 #app 的子元素p,button,text
        Array.from(childNodes).forEach(node=>{
            if(this.isElement(node)){ //判断是否是DOM元素节点
                console.log('编译该元素' + node.nodeName);
            }else if(this.isInterpolation(node)){   //判断是否是文本节点
                console.log('编译文本' + node.textContent);
            }
            if(node.childNodes && node.childNodes.length){ //判断是否还有子节点childNodes
                this.complier(node)
            }
        })
    }
    isElement(node){
        return node.nodeType === 1
    }
    isInterpolation(node){
        return node.nodeType === 3
    
    }
}

//统一调配任务,每一个watcher实例就是一个依赖
class Watcher{
    constructor(vm,key,updater){
        this.vm = vm
        this.key = key
        this.updateFrn = updater

        Dep.target = null
        Dep.target = this
        vm[key] //this.a
        

    }
    //更新视图
    update(){
        this.updateFrn(this.vm,this.vm[this.key]) //vue.a
    }
}


class Dep{
    constructor(){
        this.deps = []   //一个个的watcher实例
    }
    addDep(dep){
        this.deps.push(dep)
    }
    notify(){
        this.deps.forEach(dep=>{
            dep.update()
        })
    }
}

class Vue{
    constructor(options){
        this.$options = options
        this.$data = options.data()
        
        observer(this.$data) //将this.$data数据进行响应式处理

        proxy(this) //将data代理到this上

        new Complier(options.el,this)  

    }

    

}

new Vue({
    el:'#app',
    data(){
        return {
            a:1 ,
            b:2
        }
    },
    methods(){
        return {}
    }
})

// let obj  ={
//     age:123
//     ,name:'小明'
// }

// //数据劫持   age就被劫持，obj打印不了age
// Object.defineProperty(obj,'age',{
//     get(){
//         return 123
//     },
//     set(val){
//          val= obj.age
//         console.log(obj.age);
//     }
// })
// console.log(obj.age);  //123
// obj.age = 100