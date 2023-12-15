<template>
    <div class="nav">
        <!-- 就是a标签 -->
        <router-link to="/home">首页</router-link>  
        <router-link to="/hot">沸点</router-link>
        <router-link to="/class">课程</router-link>
       
        
    </div>
<!-- 路由路口:所有配了路由的页面都会在该口上展示 -->
    <div class="page">
        <router-view></router-view>
    </div>
   
    

</template>

<script>
    export default {
        
    }
</script>

<style lang="css" scoped>
.nav{
    width: 800px;
    background-color: aqua;
    margin: 0 auto;
    font-size: 30px;
    padding: 10px 20px;
}
a{
    text-decoration: none;
    margin-right: 30px;
}
.page{
    width: 1000px;
    height: 1000px;
    margin: 0 auto;
    background-color: #c0baba; 
    font-size: 24px;
    padding: 30px;
}
</style>