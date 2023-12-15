<template>
    <div class ="home">
        <h2>这是首页</h2>
        <nav>
            <router-link to="/home/suggest">推荐</router-link>
            <router-link to="/home/newest">最新</router-link>
        </nav>
       
    </div>
    <div class="page">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="css" scoped>
nav a{    
    margin-left:20px;

}
</style>