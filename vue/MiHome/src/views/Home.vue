<template>
    <div class="home-fu">
        <div class="home">
            <van-icon name="wap-home-o" size="20" />
            <span>刘涛的家</span>

        </div>
        <div class="wap">
            <van-icon  name="plus" size="20" @click="goSort" />
        </div>
    </div>



    <div class="fu">
        <div class="my-equipment">
            <span>我的设备</span>
        </div>
        <div class="arrows">
            <van-icon name="arrow-down" size="20" @click="showPopup" />
            <van-popup v-model:show="show" position="top" :style="{ height: '30%' }">我的导航</van-popup>
        </div>
    </div>


    <div class="subject">
        <div class="add-equipment" @click="goSort">
           
               <span> 点击添加设备</span>
        </div>
        <div class="product">
            <span class="product-name">产品</span>
            <span class="encyc">百科</span>
        </div>
    </div>
    <Navigation />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Navigation from '../components/Navigation.vue';

const router = useRouter();

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
.home-fu {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 5px;
    left: 20px;
    width: 330px;
    // padding: 10px;
    box-sizing: border-box;
    
    .home {

        text-align: left;
        margin: 5px;
        font-size: 15px;

        span {
           padding: 5px;
        }
    }

    .wap {
        
        padding: 5px;
    }
}


.fu {
    width: 330px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50px;
    left: 20px;

    .my-equipment {

        margin: 5px;
        font-size: 15px;
        text-align: left;

        span {
            color: rgb(12, 242, 154);
            border-bottom: 1px solid rgb(9, 246, 84);
            padding-bottom: 8px;
        }
    }

    .arrows {
        margin: 5px;
    }
}
.subject{
    position: absolute;
    top: 100px;
    width: 100%;
    height: 520px;
    left: 0;
    background-image: url(../photo/R-C.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    .add-equipment{
        height: 70px;
        font-size: 20px;
        //文字水平垂直居中
        display: flex;
        justify-content: center;
        align-items: center;  
        background-color: #fff;
        opacity: 0.5;//透明度
        margin: 10px;
        //边框圆角
        border-radius: .8em;
    }
    .product{
        height: 130px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;  
        background-image: url(../photo/1.jpg);
        background-size: cover;
        background-repeat: no-repeat;
        margin: 10px;
        border-radius: .8em;//边框圆角
        .product-name{
            margin: 20px;
        }
        .encyc{
            margin: 20px;
        }
    }
}
</style>