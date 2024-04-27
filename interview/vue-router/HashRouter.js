class HashRouter{
    constructor(){
        //用于存储不同hash值对应的回调函数
        this.routers = {}
    }
    // 用于注册每个视图
    register(hash,callback = function(){}){
        this.routers[hash] = callback
    }
    // 用于注册首页
    registerIndex(callback = function(){}){
        this.routers['index'] = callback
    }
    // 用于调用不同视图的回调函数
    load(){
        //拿到#后的hash值
        let hash = location.hash.slice(1),handler
        //没有hash默认是首页
        if(!hash){
            handler = this.routers.index
        }
        //未找到对应的hash值
        else if(!this.routers.hasOwnProperty(hash)){
            handler = this.routers['404'] || function(){}
        }
        else{
            handler = this.routers[hash]
        }
        // 执行注册的回调函数
        try{
            handler.apply(this)
        }catch(e){
            console.log(e);
            (this.routers['error'] || function(){}.call(this,e))
        }
        
    }
}
window.HashRouter = HashRouter