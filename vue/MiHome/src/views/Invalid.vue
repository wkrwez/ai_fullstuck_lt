<template>
    <div class="block"></div>
    <div class="head">
        <div class="header" >
            <router-link :to="'/invalid/' + 'recommend'">
                <div class="recommend " :class="{'active':recommendColor==true}"  @click="changerecommendColor()">推荐</div>
            </router-link> 
            <router-link :to="'/invalid/' + 'mined'">
                <div class="mine" :class="{'active':minedColor==true}" @click="changeminedColor()">我的</div>
            </router-link>
            <router-link :to="'/invalid/' + 'log'">
                <div class="log" :class="{'active':logColor==true}" @click="changelogColor()">日志</div>
            </router-link>
        </div>
        <van-icon class="icon-add" name="plus" size="18" />
    </div>

    <router-view></router-view>
    <Navigation />
</template>

<script setup>
import { ref } from 'vue';
import Navigation from '../components/Navigation.vue';
import router from '../router';
//导航栏颜色切换
const recommendColor = ref(true);
const minedColor = ref(false);
const logColor = ref(false);


const changerecommendColor=()=>{
    recommendColor.value=true
    minedColor.value=false
    logColor.value=false
    nav.value = '6.3em';

}
const changeminedColor=()=>{
    recommendColor.value=false
    minedColor.value=true
    logColor.value=false
    nav.value = '10.3em';

}
const changelogColor=()=>{
    recommendColor.value=false
    minedColor.value=false
    logColor.value=true
    nav.value = '14.3em';
}

//伪元素导航
const nav = ref('6.3em');

</script>

<style lang="less" scoped>
*{
    font-size: 15px;
    color: #000;
}

.head{
    position: fixed;
    height: 3em;
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    
    .header {
        display: grid;
        grid-template-columns: 4em 4em 4em;
        justify-content: center;
        align-items: center;
        width: 90%;
        height: 50%;
        position: relative;
        
        &::after{
                content: '';
                display: block;
                width: 2em;
                height: 2px;
                background: #11f409;
                position: absolute;
                // left: 6.3em;
                // left: 10.3em;
                // left: 14.3em;
                left: v-bind(nav);
                bottom: -0.5em;
                transition: left 0.5s ease;
            } 
        .recommend{
            
        }
        .active{
            color: green;
            
            
            
        }
        
        
    }
    .icon-add{
        flex: 1;
    }
}

</style>