<template>
    <Navigation />
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
                <li class="from-list-item" @click="handleClick(index)" 
                :class="{ 'active': activeIndex === index }" 
                v-for="(item, index) in liList" :key="index">{{ item }}</li>
            </ul>

        </div>

    </div>
    <div class="head-block"></div>
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
    <!-- 超级品牌日 -->
    <div class="super">
        <div class="box">
            <div class="tv"></div>
            <div class="super-mi">
                纯米超级品牌日
                <div class="samll">
                    厨房家电 营养粥羹 42元起
                </div>
            </div>
            <div class="look">去看看</div>
        </div>
    </div>
    <!-- 更多推荐 -->
    <div class="title-total">
        <!-- 有品推荐 -->
        <div class="title">
            <div class="header">
                <div class="title-text">有品推荐</div>
                <div class="title-more">
                    <span>更多</span>
                    <van-icon name="arrow" size="15" />
                </div>
            </div>
            <div class="big-box">
                <p class="box-text">双珏熠辉月饼礼盒</p>
                <p class="box-info">日式桃山皮，四位创新馅料...</p>
                <p class="money">￥149</p>
            </div>
            <div class="small-box">
                <div class="small-item">
                    <p class="small-text">运动秋季游</p>
                    <p class="small-info">服饰鞋靴 限量买一送一</p>
                </div>
                <div class="small-index">
                    <p class="small-text">开学季VS入职季</p>
                    <p class="small-info">KACO文具专场 爆款直降</p>
                </div>
            </div>
            <div class="block-box"></div>
        </div>
        <!-- 小米众筹 -->
        <div class="title">
            <div class="header">
                <div class="title-text">小米众筹</div>
                <div class="title-more">
                    <span>更多</span>
                    <van-icon name="arrow" size="15" />
                </div>
            </div>
            <div class="big-box">
                <p class="big-text">小米净水器1A ( 厨下式 )</p>
                <p class="big-info">8.9-8.10净水专场 立省50元</p>
                <span class="money-text">1449</span>元
                <span class="money-info">1499元</span>
            </div>
            <div class="small-box">
                <div class="small-item">
                    <p class="small-item-text">灭火英雄 镇定守护</p>
                    <p class="small-item-info">灭火不复燃 | 手持360°喷射 | 制作逃生毯 | 无毒环保</p>
                </div>
                <div class="small-index">
                    <p class="small-item-text">超大细腻喷雾 水润直达肌底</p>
                    <p class="small-item-info">超声波振频 | 微米级雾化颗粒 | 赠50ML奇异果鲜活水</p>
                </div>
            </div>
            <div class="block-box"></div>
        </div>
        <!-- 每日新品 -->
        <div class="title">
            <div class="header">
                <div class="title-text">小米众筹</div>
                <div class="title-more">
                    <span>更多</span>
                    <van-icon name="arrow" size="15" />
                </div>
            </div>
            <div class="big-box">
                <p class="big-text">水晶石英腕表</p>
                <p class="big-info">优雅于心 闪耀于形</p>
                <div class="new-money">
                    <span class="new">新品</span>
                    <div class="money-text-new">369</div>
                    <span class="new-text">元</span>
                </div>
            </div>
            <div class="small-box">
                <div class="small-item">
                </div>
                <div class="small-index">
                </div>
            </div>
        </div>
    </div>
    <div class="box-block"></div>
</template>

<script setup>
import { ref } from 'vue';
import Navigation from '../components/Navigation.vue';

const liList = ref([
    '推荐', '手机', '居家', '家电', '智能', '影音', '服饰', '餐厨'
    , '健康', '笔记本', '鞋包', '饮食', '杂志',
])

const nav = ref(10 + 'px')

//列表切换颜色
const activeIndex = ref(0);
const handleClick = (index)=>{
    nav.value = (60 *index  + 10 * index + 11) + 'px';
    activeIndex.value = index;
}
</script>

<style lang="less" scoped>
.head {
    position: fixed;
    background-color: #fff;
    width: 100%;
    z-index: 999;

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
        width: 100%;
        margin-top: 10px;
        overflow: auto;
        clip-path: inset(0 0 12% 0); //剪切滚动条部分
        // position: relative;
        

        .icon-down {
            position: fixed;
            right: 0;
            background-color: #fff;
            width: 30px;
            text-align: center;
            z-index: 99;
        }

        .from-list {
            display: flex;
            position: relative;
            .from-list-item {
                font-size: 14px;
                text-align: center;
                width: 50px;
                margin-right: 20px;
                
                
            }
            .active{
                
                color: rgb(129,93,55);
                
            }
            &::after{
                    content: "";
                    display: block; 
                    width: 30px;
                    height: 5px;
                    background-color: rgb(129,93,55);
                    position: absolute;
                    top: 24px;
                    left: v-bind(nav); 
                    transition: left 0.5s ease;
                }
        }


    }

}

.head-block {
    height: 94px;
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
    padding-top: 10px;
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

            font-size: 22px;
            margin-top: 15px;
            color: #fff;

            .samll {
                height: 15px;
                width: 150px;
                font-size: 11px;
                background-color: rgb(250, 219, 142);
                display: flex;
                justify-content: center;
                word-spacing: 5px;
                align-items: center;
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

.title {
    height: 300px;
    width: 100%;
    margin-bottom: 10px;

    //有品推荐
    .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title-text {
            padding: 15px;
        }

        .title-more {
            padding: 15px 15px 15px 0;
        }
    }

    .big-box {
        height: 130px;
        width: 90%;
        background-color: rgb(247, 239, 247);
        margin: 0 auto;
        padding-left: 5px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;

        // 有品推荐
        .box-text {
            font-size: 9px;
            padding-top: 10px;
        }

        .box-info {
            font-size: 8px;
            margin-top: 10px;
            color: rgb(160, 159, 160);
        }

        .money {
            color: rgb(183, 7, 7);
            margin-top: 10px;
            font-size: 8px;
        }

        //小米众筹
        .big-text {
            font-size: 16px;
            word-spacing: 3px;
            padding: 20px 0 7px 16px;
        }

        .big-info {
            padding-left: 16px;
            padding-bottom: 15px;
            font-size: 13px;
            font-family: "黑体";
            color: rgb(133, 146, 154);
        }

        .money-text {
            font-size: 20px;
            padding-left: 16px;
            color: red;
            font-family: system-ui;
        }

        .money-info {
            text-decoration: line-through;
            color: rgb(160, 159, 160);
            font-family: system-ui;
        }

        //每日新品
        .new-money {
            display: flex;
            align-items: center;

            .new {
                padding: 2px 5px 2px 5px;
                margin-left: 16px;
                background-color: #10c310;
                color: #fff;
            }

            .money-text-new {
                color: red;
                font-size: 25px;
                padding-left: 5px;

            }

            .new-text {
                padding-top: 3px;
            }
        }

    }

    .small-box {
        height: 130px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .small-item {
            height: 120px;
            width: 45%;
            background-color: rgb(237, 247, 236);
            margin-left: 15px;
            word-spacing: 3px;
            font-size: 13px;
            border-bottom-left-radius: 10px;

        }

        .small-index {
            height: 120px;
            width: 45%;
            background-color: rgb(249, 239, 237);
            margin-right: 15px;
            word-spacing: 3px;
            border-bottom-right-radius: 10px;
        }

        .small-text {
            font-size: 12px;
            margin: 10px 0 5px 10px;

        }

        .small-info {
            font-size: 8px;
            color: rgb(160, 159, 160);
            margin-left: 10px;
        }

        //小米众筹
        .small-item-text {
            text-align: center;
            font-size: 8px;
            font-weight: 400;
            padding-top: 15px;
        }

        .small-item-info {
            text-align: center;
            font-size: 5px;
            padding-top: 10px;
            word-spacing: 2px;
            color: rgb(160, 159, 160);
        }
    }

    .block-box {
        height: 10px;
        background-color: rgb(237, 237, 237);
    }


}

.box-block {
    height: 50px;
}
</style>
<style>
.van-search__content {
    border-radius: 10px;
}</style>