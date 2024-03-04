<template>
    
    <div class="head">
        <div class="search">
            <img src="../photo/lock.jpg" class="imgUrl">
            <van-search v-model="value" placeholder="纯米超级品牌日" />
            <van-icon name="shopping-cart-o" size="30" dot />
            <van-icon name="ellipsis" size="30" />
        </div>
        <div class="from">
            <van-icon class="icon-down" size="15" name="arrow-down" @click="openLiList()" />
            <ul class="from-list">
                <li class="from-list-item" @click="handleClick(item.id)" 
                :class="{ 'active': activeIndex === item.id }" 
                v-for="(item, index) in liList" :key="item.id">{{ item.name }}</li>
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
        <div class="new">
            <img src="../photo/1.jpg" alt="">
            <text>小米众筹</text>
        </div>
        <div class="new">
            <img src="../photo/1.jpg" alt="">
            <text>限时抢购</text>
        </div>
        <div class="new">
            <img src="../photo/1.jpg" alt="">
            <text>星品驾到</text>
        </div>
        <div class="new">
            <img src="../photo/1.jpg" alt="">
            <text>王牌推荐</text>
        </div>
    </div>
    <!-- 超级品牌日 -->
    <div class="super">
        <img src="../photo/quality/supermi.png" alt="">
       
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
    
    <Navigation />
</template>

<script setup>
import { ref } from 'vue';
import Navigation from '../components/Navigation.vue';

const typeface = ref(0.4 + 'rem')
const liList = ref([
    {name:'推荐',id:1},
    {name:'手机',id:2},
    {name:'居家',id:3},
    {name:'家电',id:4},
    {name:'智能',id:5},
    {name:'影音',id:6},
    {name:'服饰',id:7},
    {name:'餐厨',id:8},
    {name:'健康',id:9},
    {name:'笔记本',id:10}, 
    {name:'鞋包',id:11},
    {name:'饮食',id:12},
    {name:'杂志',id:13},
    {name:' ',id:14}
])
//列表切换颜色
const nav = ref(0.5 + 'rem')

const activeIndex = ref(0);

const handleClick = (index)=>{
    nav.value = (0.5 + (index-1)*1.6 ) + 'rem';
    activeIndex.value = index;
}

const openLiList = ()=>{

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
        margin-left: 0.3rem;
        margin-right: 0.3rem;
        height: 1.8rem;
    }

    .from {
        height: 0.8rem;
        width: 100%;
        margin-top: 0.3rem;
        overflow-x: scroll;
        white-space: nowrap;
        
        &::-webkit-scrollbar{
            display: none;
        }
        .icon-down {
            position: fixed;
            right: 0;
            background-color: #fff;
            width: 1rem;
            height: 0.8rem;
            text-align: center;
            z-index: 999;
        }

        .from-list {
            position: relative;
            
            .from-list-item {
                
                font-size: 0.4rem;
                text-align: center;
                width: 1.3rem;
                margin-left: 0.3rem;
                display: inline-block;
                // margin-left: 0.3rem;

                
            }
            .active{ 
                color: rgb(129,93,55);
                font-size: 0.45rem;
                
            }
            &::after{
                    content: "";
                    display: block; 
                    width: 0.8rem;
                    height: 0.1rem;
                    background-color: rgb(129,93,55);
                    position: absolute;
                    top: 0.65rem;
                    left: v-bind(nav); 
                    transition: left 0.5s ease;
                }
        }


    }

}

.head-block {
    height: 2.9rem;
}

.swiper {
    height: 6rem;
    width: 100%;

    .my-swipe {
        height: 6rem;

        img {
            width: 100%;

        }
    }

}

.store {
    width: 100%;
    height: 3rem;
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    justify-content: center;
    align-items: center;
    margin-top: 0.2rem;
    img {
        margin: 0.3rem;
        width: 1.3rem;
        height: 1.5rem;
        object-fit: cover;

    }
    .new{
        text-align: center;
    }
}

.super {
    height: 3rem;
    width: 100%;
    margin: 0.2rem 0;
    background-color: rgb(246, 246, 246);
    display: flex;
    align-items: center;
    img{
        width: 100%;
        height: 2.5rem;
        object-fit: cover;
    }

}

.title {
    height: 7rem;
    width: 100%;
    //有品推荐
    .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title-text {
            padding: 0.3rem;
        }

        .title-more {
            padding: 0.3rem 0.3rem 0.3rem 0;
        }
    }

    .big-box {
        height: 2.7rem;
        width: 90%;
        background-color: rgb(247, 239, 247);
        margin: 0 auto;
       
        padding-left: 0.1rem;
        border-top-right-radius: 0.2rem;
        border-top-left-radius: 0.2rem;

        // 有品推荐
        .box-text {
            font-size: 0.3rem;
            padding-top: 0.2rem;
        }

        .box-info {
            font-size: 0.2rem;
            margin-top: 0.2rem;
            color: rgb(160, 159, 160);
        }

        .money {
            color: rgb(183, 7, 7);
            margin-top: 0.2rem;
            font-size: 0.2rem;
        }

        //小米众筹
        .big-text {
            font-size: 0.3rem;
            word-spacing: 0.1rem;
            padding: 0.4rem 0 0.22rem 0.3rem;
        }

        .big-info {
            padding-left: 0.3rem;
            padding-bottom: 0.3rem;
            font-size: 0.3rem;
            font-family: "黑体";
            color: rgb(133, 146, 154);
        }

        .money-text {
            font-size: 0.4rem;
            padding-left: 0.3rem;
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
                padding: 0.05rem 0.1rem 0.01rem 0.1rem;
                margin-left: 0.3rem;
                background-color: #10c310;
                color: #fff;
            }

            .money-text-new {
                color: red;
                font-size: 0.5rem;
                padding-left: 0.1rem;

            }

            .new-text {
                padding-top: 0.15rem;
            }
        }

    }

    .small-box {
        height: 3rem;
        width: 90%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;

        .small-item {
            height: 2.7rem;
            width: 48%;
            background-color: rgb(237, 247, 236);
            
            word-spacing: 3px;
            font-size: 13px;
            border-bottom-left-radius: 10px;

        }

        .small-index {
            height: 2.7rem;
            width: 48%;
            background-color: rgb(249, 239, 237);
            word-spacing: 3px;
            border-bottom-right-radius: 0.2rem;
        }

        .small-text {
            font-size: 0.3rem;
            margin: 0.2rem 0 0.1rem 0.2rem;

        }

        .small-info {
            font-size: 0.2rem;
            color: rgb(160, 159, 160);
            margin-left: 0.2rem;
        }

        //小米众筹
        .small-item-text {
            text-align: center;
            font-size: 0.2rem;
            font-weight: 400;
            padding-top: 0.3rem;
        }

        .small-item-info {
            text-align: center;
            font-size: 0.1rem;
            padding-top: 0.2rem;
            word-spacing: 0.05rem;
            color: rgb(160, 159, 160);
        }
    }

    .block-box {
        height: 0.2rem;
        background-color: rgb(237, 237, 237);
    }


}


</style>
<style>
.van-search__content {
    border-radius: 10px;
}</style>