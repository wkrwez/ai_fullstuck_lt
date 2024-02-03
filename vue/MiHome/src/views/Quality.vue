<template>
    <div class="head">
        <div class="search">
            <img src="../photo/lock.jpg" class="imgUrl">
            <van-search v-model="value" placeholder="纯米超级品牌日" />
            <van-icon name="shopping-cart-o" size="20" dot />
            <van-icon name="ellipsis" size="20" />
        </div>
        <div class="from">
            <van-icon class="icon-down" size="15" name="arrow-down" />
            <ul class="from-list">
                <li class="from-list-item" v-for="(item, index) in liList" :key="index">{{ item }}</li>
            </ul>

        </div>

    </div>
    <!-- 轮播图 -->
    <div class="swiper">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item>
                <img src="../photo/1.jpg" alt="">
            </van-swipe-item>
            <van-swipe-item><img src="../photo/1.jpg" alt=""></van-swipe-item>
            <van-swipe-item><img src="../photo/R-C.jpg" alt=""></van-swipe-item>
            <van-swipe-item><img src="../photo/1.jpg" alt=""></van-swipe-item>
        </van-swipe>
    </div>

    <div class="store">
        <div class="new">
            <img src="../photo/1.jpg" alt="">
            <text>每日新品</text>
        </div>
        <div class="crowd">
            <img src="../photo/1.jpg" alt="">
            <text>小米众筹</text>
        </div>
        <div class="limit">
            <img src="../photo/1.jpg" alt="">
            <text>限时抢购</text>
        </div>
        <div class="star">
            <img src="../photo/1.jpg" alt="">
            <text>星品驾到</text>
        </div>
        <div class="recommend">
            <img src="../photo/1.jpg" alt="">
            <text>王牌推荐</text>
        </div>
    </div>

    <div class="super">

        <div class="box">
            <div class="tv"></div>
            <div class="super-mi">
                纯米超级品牌日
                <div class="samll">
                    <div>厨房家电</div>
                    <div>营养粥羹</div>
                    <div>42元起</div>
                </div>
            </div>
            <div class="look">去看看</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const liList = ref([
    '推荐', '手机', '居家', '家电', '智能', '影音', '服饰', '餐厨'
    , '健康', '笔记本', '鞋包', '饮食', '杂志',
])


</script>

<style lang="less" scoped>
.head {

    .search {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 10px;
        margin-right: 10px;

    }

    .from {
        display: flex;
        height: 30px;
        margin-top: 10px;
        overflow: auto;
        clip-path: inset(0 0 50% 0); //剪切滚动条部分
        position: relative;

        .icon-down {
            position: fixed;
            right: 0;
            background-color: #fff;
            width: 40px;
            text-align: center;
        }

        .from-list {
            display: flex;

            .from-list-item {
                font-size: 14px;
                text-align: center;
                width: 50px;
                margin-right: 20px;

            }
        }


    }

}

.swiper {
    height: 200px;
    width: 100%;

    .my-swipe {
        height: 210px;

        img {
            width: 100%;

        }
    }

}

.store {
    width: 100%;
    height: 100px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    text-align: center;
    margin-top: 10px;

    .new {}

    img {
        margin: 10px;
        width: 50px;
        height: 60px;

    }
}

.super {
    height: 100px;
    width: 100%;
    background-color: rgb(246, 246, 246);
    display: flex;
    align-items: center;

    .box {
        height: 70px;
        width: 90%;
        background-color: rgb(244, 204, 149);
        margin: 0 auto;
        text-align: center;
        border-radius: 50px;
        display: flex;

        .tv {
            width: 120px;
            height: 70px;

        }

        .super-mi {

            font-size: 20px;
            margin-top: 10px;
            color: #fff;

            .samll {
                height: 15px;
                width: 150px;
                font-size: 10px;
                background-color: rgb(250, 219, 142);
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 5px;
                padding: 0 8px;
                border-radius: 50px;
                color: black;
                font-family: SimHea;
            }
        }

        .look {
            width: 47px;
            height: 47px;
            margin: 0 5px 0 10px;
            background-color: rgb(245, 233, 206);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            border: 2px solid rgb(224, 164, 78);
            
        }


    }
}
</style>
<style>
.van-search__content {
    border-radius: 10px;
}
</style>