function Block(){
    this.upDivWrap=null
    this.downDivWrap=null
    this.gapHeight=baseObj.randomNum(150,160)    //间隙
    this.downHeight=baseObj.randomNum(0,150)
    this.upHeight=312-this.downHeight-this.gapHeight

    //生成div
this.createDiv=function(url,height,positionType,left,top){
    var newDiv=document.createElement('div')
    newDiv.style.width='62px'
    newDiv.style.height=height
    newDiv.style.position=positionType
    newDiv.style.left=left
    newDiv.style.top=top
    newDiv.style.backgroundImage=url
    return newDiv
    
}
//生成管道
this.createBlock=function(){
    //上方管道
    var upDiv1=this.createDiv('url(img/up_mod.png)',this.upHeight+'px')
    var upDiv2=this.createDiv('url(img/up_pipe.png)','60px')
    this.upDivWrap=this.createDiv(null,null,'absolute','450px','0px')
    //连接管道
    this.upDivWrap.appendChild(upDiv1)
    this.upDivWrap.appendChild(upDiv2)

    //下方管道
    var downDiv1 = this.createDiv('url(img/down_mod.png)',this.downHeight+'px') 
    var downDiv2 = this.createDiv('url(img/down_pipe.png)','60px')
    this.downDivWrap= this.createDiv(null,null,'absolute','450px',363-this.downHeight+'px')
    this.downDivWrap.appendChild(downDiv2)
    this.downDivWrap.appendChild(downDiv1)

    jsWarpBg.appendChild(this.upDivWrap)
    jsWarpBg.appendChild(this.downDivWrap)
}

//移动管道

this.moveBlock=function(){
    this.upDivWrap.style.left=this.upDivWrap.offsetLeft-3 +'px'
    this.downDivWrap.style.left=this.downDivWrap.offsetLeft-3 +'px'

}


}


var b=new Block()