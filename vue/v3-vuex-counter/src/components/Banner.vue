<template>
    <div>
        <ul>
            <li v-for="banner in banners">
                <img :src="banner.pic" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useBannerStore } from '../store/banner';
import { defineProps, onMounted, toRefs } from 'vue';
const props = defineProps({
    'per-page': {
        type: Number,
        default: 10
    }
})
// 借pinia store banners 来到本地组件
const {banners} = toRefs(useBannerStore());
const { getBanners } = useBannerStore();
onMounted(async () => {
    // 先让组件显示出来， 用户的第一眼 要快
    // 等组件显示 了，再去请求 因为js 是单线程 ·
//    const data =  await getBannerData(); // 应该属于store 
//    console.log(data);
    await getBanners() // action 
    console.log(banners)
})


</script>

<style scoped>

</style>