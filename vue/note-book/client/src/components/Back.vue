<template>
    <div class="back">
        <van-icon name="arrow-left" size="20" @click="goBack"/>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

//返回上一级
const goBack =()=>{
    router.back()
}
</script>

<style lang="less" scoped>
.back{
    margin: 0.2rem 0 0.2rem 0.5rem;
}
</style>