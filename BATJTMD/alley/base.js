  /* 提供一个适配所有机型的rem工具 */
        // 1.屏幕宽度
        // 2.html
        // 3.font-size  /10 
        //要考虑ipad
        
        
        // 立即执行函数  闭包常用
(function(){
    //性能  DOM开销性能比较大
    var htmlElement = document.documentElement;
    //DRY  不要重复代码
   function getFonSize(){
    var width = window.innerWidth; 
    var fontSize = width/10;
    return fontSize;
   }

    //获取客户手机宽度
     
                    // var width = window.innerWidth; //document.documentElement.clientWidth 
                   // var fontSize = width/10;
    
     htmlElement.style.fontSize = getFonSize() + 'px'; //document.documentElement

    //横屏与竖屏切换自动获取
    window.addEventListener('resize', function() {
                                               // var width = window.innerWidth; 
                                               // var fontSize = width/10;
    htmlElement.style.fontSize = getFonSize() + 'px';//document.documentElement
})
    // html 动态设置fon-size
    // 函数作用域
    // 变量，不会污染到外面
})()