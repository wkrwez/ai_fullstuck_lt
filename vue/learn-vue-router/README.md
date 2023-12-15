# Vue 单页应用
    整个项目只有一个html文件

    在Vue中我们写的每一个页面其实都是一个html代码片段

    通过特殊的手段来实现，每次只让一个代码片段生效，也就模拟成了多个html文件一样的效果
 npm run serve启动

# vue-router
    就是特殊的手段

    1. router-link
    2. router-view
    3. 二级路由
    

- 路由跳转
1. router-link
2. 编程式路由跳转  this.$router.push()
3. 路由传参 
{path:'xxx',query:{}}
{name:'xxx',params:{}}