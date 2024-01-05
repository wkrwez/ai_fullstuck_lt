<template>

        <van-tabbar v-model="active" active-color="#1beaae" route>
            <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item to="/category" icon="star-o">分类</van-tabbar-item>
            <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
            <van-tabbar-item to="/user" icon="setting-o">我的</van-tabbar-item>
        </van-tabbar>
       
</template>

<script setup>
import {ref} from 'vue'
const active = ref(0)

</script>

<style lang="less" scoped></style>