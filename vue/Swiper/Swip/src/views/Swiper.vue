<template>
    <div>
        <div class="all">
            <div class="picture" :class="{'transfor':count !==0}">
                <div class="all-img "  v-for="item in props.list" :key="item.id">
                    <img :src="item.imgUrl">
                </div>
            </div>
            <div class="left active" @click="getLeft">+</div>
            <div class="right active" @click="getRight">-</div>
            <div class="all-item">
                <span @click="getBlack" v-for="(item, index) in props.list" :key="index"></span>
            </div>

        </div>
    </div>
</template>

<script setup>

import { onMounted, ref,  } from 'vue'

onMounted(() => {
    continueRun()
})

const current = ref(0)
const content = ref(0)  //指哪张图片
const count = ref(0)  //轮播计数
const timer = ref(null) //启动轮播的定时器
const tims = ref(null) //点击小黑点启动轮播


const props = defineProps({
    list: Array
})


const getLeft = (id) => {

}

const getRight = () => {
    count.value++
    if (count.value > 4) {
        count.value = 0
    }

    content.value = count.value * -800 + 'px'
    clearTimeout(timer.value)
    tims.value = null

    tims.value = continueRun()

}

//几个小黑点
const getBlack = (e) => {
    current.value = e.target.__vnode.key
    content.value = current.value * -800 + 'px'
    clearTimeout(timer.value)
    clearTimeout(tims.value)

    tims.value = setTimeout(() => {
        continueRun()
    }, 1000)


}
//启动轮播
const Run = () => {
    return new Promise((resolve) => {
        timer.value = setTimeout(() => {
            count.value = count.value + 1
            if (count.value > 4) {
                count.value = 0
            }
            content.value = count.value * -800 + 'px'
            resolve()
        }, 2000);
    })

}
//持续启动轮播
const continueRun = () => {
    Promise.resolve().then(() => {
        return Run()
    }).then(() => {
        return continueRun()
    })
}

</script>

<style lang="less" scoped>
.all {
    height: 400px;
    width: 800px;
    background-color: #eb7676;
    display: flex;
    overflow: hidden;
    position: relative;
    margin: 100px auto;
    
    .picture {
        position: absolute;
        display: flex;
        left: v-bind(content);
        
        img {
            width: 800px;
            height: 400px;
            object-fit: cover;
            
        }
        

        
    }
    //图片的平滑切换
    .transfor{
        transition: left 0.5s ease;
    }

    //按钮的公共样式
    .active {
        background-color: #372b2b;
        height: 400px;
        width: 50px;
        position: absolute;
        opacity: 0.5;
        color: #f4efef;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .left {
        left: 0;
    }

    .right {
        right: 0;
    }

    .all-item {
        position: absolute;
        width: 100%;
        height: 20px;
        display: flex;
        bottom: 0;
        justify-content: center;
        align-items: center;

        span {
            width: 20px;
            height: 20px;

            background-color: black;
            margin: 5px;
            border-radius: 50%;

            .li-active {
                color: white
            }

        }
    }

}

</style>