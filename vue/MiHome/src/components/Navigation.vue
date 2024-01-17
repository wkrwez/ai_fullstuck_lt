<template>
    <div>
        <van-tabbar v-model="active" active-color="#1baeae">
            <van-tabbar-item icon="home-o" >米家</van-tabbar-item>
            <van-tabbar-item icon="bag-o">有品</van-tabbar-item>
            <van-tabbar-item icon="qr-invalid">智能</van-tabbar-item>
            <van-tabbar-item icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(0)

</script>

<style lang="scss" scoped></style>