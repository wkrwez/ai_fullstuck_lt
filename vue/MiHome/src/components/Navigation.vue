<template>
    <div>
        <van-tabbar v-model="active" active-color="#1baeae" route>
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

<style lang="scss" scoped></style>