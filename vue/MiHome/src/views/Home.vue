<template>
    <div class="all">
        <div class="head">
            <div class="home-fu">
                <div class="home">
                    <van-icon name="wap-home-o" size="30" />
                    <span>刘涛的家</span>

                </div>
                <div class="wap">
                    <van-icon name="plus" size="30" @click="goSort" />
                </div>
            </div>
            <div class="fu">
                <div class="my-equipment">
                    <span>我的设备</span>
                </div>
                <div class="arrows">
                    <van-icon name="arrow-down" size="30" @click="showPopup" />
                    <van-popup v-model:show="show" position="top" :style="{ height: '30%' }">我的导航</van-popup>
                </div>
            </div>
        </div>
        <!-- 添加设备 -->
        <div class="subject">
            <div class="add-equipment" @click="goSort">
                <span> 点击添加设备</span>
            </div>
            <div class="product">
                <span class="product-name">产品 百科</span>
            </div>
        </div>
    </div>
    <Navigation />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Navigation from '../components/Navigation.vue';

const router = useRouter();
// console.log(get.Phone);

// 跳转到分类页面
const goSort = () => {
    router.push('/sort')
}
// 弹出框
const show = ref(false);
const showPopup = () => {
    show.value = true;
};


</script>

<style lang="less" scoped>
.all {
    width: 100%;
    height: 93%;
    background-image: url(../photo/shouye/shouye.jpeg);
    background-size: cover;
    background-repeat: no-repeat;
    position: fixed;

    .head {
        width: 100%;
        background-color: #fff;
        margin-bottom: 0.1rem;
        .home-fu {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 0.6rem;
            .home {
                margin: 0.5rem 0 0 0.5rem;

                span {
                    padding: 0.2rem;
                }
            }

            .wap {
                margin: 0.5rem 0.5rem 0 0;
            }
        }


        .fu {
            padding-bottom: 0.3rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 0.8rem;
            .my-equipment {
                margin: 0 0 0 0.5rem;
                font-size: 0.6rem;
                align-items: center;

                span {

                    color: rgb(12, 242, 154);
                    border-bottom: 0.02rem solid rgb(9, 246, 84);
                    padding-bottom: 0.1rem;
                }
            }

            .arrows {
                margin: 0 0.5rem 0 0;
            }
        }
    }



    .subject {
        width: 100%;
        height: 80%;
        margin-top: 0.3rem;


        .add-equipment {
            height: 15%;
            font-size: 0.5rem;
            //文字水平垂直居中
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            opacity: 0.5; //透明度
            margin: 0.2rem 0.2rem 0.5rem 0.2rem;
            //边框圆角
            border-radius: 0.3rem;
        }

        .product {
            height: 30%;
            font-size: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url(../photo/shouye/baike.jpg);
            background-size: cover;
            background-repeat: no-repeat;
            margin: 0.2rem 0.2rem 0.5rem 0.2rem;
            border-radius: 0.3rem; //边框圆角
            word-spacing:  1rem;
            color: #fff;
            
            
        }
    }
}
</style>

<style>
#app {
    height: 100%;
}
</style>