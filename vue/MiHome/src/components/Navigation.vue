<template>
    <div class="bottom">
        <van-tabbar placeholder="true"   class="boe-bottom" v-model="active" active-color="#1baeae" route>
            <van-tabbar-item to="/home" icon="home-o" >米家</van-tabbar-item>
            <van-tabbar-item to="/quality" icon="bag-o">有品</van-tabbar-item>
            <van-tabbar-item to="/invalid" icon="qr-invalid">智能</van-tabbar-item>
            <van-tabbar-item to="/mine" icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
        
    </div>
    
</template>

<script setup>
import { ref } from 'vue'
const active = ref(0)

</script>

<style lang="less" scoped>

</style>
<style>
.van-tabbar{
    height: 2rem;
}
</style>