export default class Swipers{
    constructor(option){
        this.option = option
        this.init()
        this.pageList()
        
    }
    init(){
        this.content = document.getElementsByClassName(this.option.content)
        this.page = document.getElementsByClassName(this.option.page)
    }
    pageList(){
        [...this.page].forEach((item,index)=>{
            item.onclick=function(){
                console.log(index);
            }
        })
    }
}