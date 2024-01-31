<template>
    <div >
        <van-nav-bar fixed="true"  left-text="返回" 
        left-arrow
        @click-left="goBack"
        >
        <template #title>
            <van-search v-model="value" placeholder="搜索" />     
            </template>
            <template #right>
                <img src="../photo/lanya.png" alt="" width="28px" height="22px">     
            </template>
        </van-nav-bar>
    </div>
    <div class="block"></div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goBack = () => {
    router.push('/home')
}
</script>

<style lang="less" scoped>
.block{
    height: 46px;
}
.van-search{
    height: 46px;
}
    


</style>