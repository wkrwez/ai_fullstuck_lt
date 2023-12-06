// 数据存储结构 
const MyQueue = function(){
    this.stack1 = []
    this.stack2 = []
}
// 行为
MyQueue.prototype = {
    push:function(){
        this.stack1.push(x)
    },
    pop:function(){
        if(this.stack2.length <=0){
            while(this.stack1.length !=0){
                this.stack2.push(this.stack1.pop())
            }
        }
        return this.stack2.pop()

    },
    peek:function(){

    },
    empty:function(){

    }

}