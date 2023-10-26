var bird={
    flyTimer:null,//小鸟下落的定时器
    wingTimer:null,//小鸟扇动翅膀的定时器
    div:document.createElement('div'),//在html里面创建一个div标签
    showBird:function(parentObj){
        this.div.style.width='40px'
        this.div.style.height='28px'
        this.div.style.backgroundImage='url(img/bird0.png)'
        this.div.style.backgroundRepeat='no-repeat'
        this.div.style.position='absolute'
        this.div.style.left='50px'
        this.div.style.top='200px'
        this.div.style.zIndex=2
        parentObj.appendChild(this.div)
        
    },

    //小鸟下落
    fallSpeed:0,//下落速度
    flyBrid:function(){
        //控制小鸟的top值
        bird.flyTimer=setInterval(fly,60)
        function fly(){
            bird.div.style.top=bird.div.offsetTop +bird.fallSpeed++ + 'px'
            if(bird.div.offsetTop>=390){
                 clearInterval(bird.flyTimer )
                 clearInterval(bird.wingTimer)
                 bird.fallSpeed=0
            }
            //触顶
            if(bird.div.offsetTop<=0){
                bird.div.style.top='0px'
                bird.fallSpeed=2

            }
        }
        
    },
    //翅膀的摆动
    wingWave:function(){
        var up = ['url(img/up_bird0.png)', 'url(img/up_bird1.png)']
        var down = ['url(img/down_bird0.png)', 'url(img/down_bird1.png)']
        var i=0,j=0;

       bird.wingTimer= setInterval(wing,120)
        function wing(){
            //下落
            if(bird.fallSpeed>0){
               bird.div.style.backgroundImage=down[i++]
               if(i>1){
                i=0;
               }
            }
            //上升
            if(bird.fallSpeed<0){
                bird.div.style.backgroundImage=up[j++]
                if(j>1){
                 j=0;
                }
            }
        }
    }
    
}
 