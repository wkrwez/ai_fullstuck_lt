<template>
    <div class="block"></div>
    <div class="box" v-for="item in charact.charact" :key="item.id">
        <div class="content">
            <div class="charact">
                {{ item.content }}
            </div>
            <img :src="item.imgUrl" alt="">
        </div>
    </div>
    
</template>

<script setup>
import { reactive } from 'vue';
import haze from '../../photo/invalid/wumai1.png'
import dew from '../../photo/invalid/qingxin.png'
import indoor from '../../photo/invalid/shinei.png'
import sun from '../../photo/invalid/luori.jpeg'
import gohome from '../../photo/invalid/huijia.png'
import away from '../../photo/invalid/lijia.png'

const charact = reactive({
    charact: [
        {
            id: 1,
            content: '雾霾天自动开启空气净化器',
            imgUrl: haze
        },
        {
            id: 2,
            content: '回家自动打开空净',
            imgUrl:dew 
        },
        {
            id: 3,
            content: '室内pm2.5过高时开启空净',
            imgUrl: indoor
        },
        {
            id: 4,
            content: '日落时通知我',
            imgUrl: sun
        },
        {
            id: 5,
            content: '回家自动开启',
            imgUrl: gohome
        },
        {
            id: 6,
            content: '离家时自动打扫',
            imgUrl: away
        },

    ]
});
</script>

<style lang="less" scoped>
* {
    font-size: 15px;
}

.box {
    display: flex;
    justify-content: center;

    .content {
        width: 90%;
        height: 150px;
        margin: 0.3em 0 0.3em 0;
        border-radius: 2%;
        position: relative;
        display: inline-block;
        

        .charact {
            margin: 1em;
            position: absolute;
            color: white;
            z-index: 999;
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 2%;
            //图片完美显示
            object-fit: cover;
            display: block;
            //调整元素亮度，会导致文字遮挡，提高文字优先级
            filter: brightness(0.8);
        }
    }
}

.block {
    height: 3.5em;
}
</style>