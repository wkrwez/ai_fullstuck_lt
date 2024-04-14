<template>
    <div>
        <div  class="all">
           <div class="picture">
            <div  class="all-img" v-for="item in props.list" :key="item.id"> 
                <img :src=" item.imgUrl ">
            </div>
        </div>
            <div class="left active" @click="getLeft">+</div>
            <div class="right active" @click="getRight">-</div>
            <ul class="all-item" @click="getBlack">
                <li v-for="(item,index) in list.length" :key="index"></li>
            </ul>
            
        </div>
    </div>
</template>

<script setup>
import Swipers from '../Swiper.js'
import {onMounted, ref} from 'vue'



const current = ref(0)
const content = ref(0)


const props = defineProps({
    list:Array
})


const getLeft = (id)=>{

}

const getRight = ()=>{

}

const getBlack= (e)=>{
   current.value = e.target.__vnode.key
   content.value = current.value*-800 + 'px'

}


</script>

<style lang="less" scoped>
.all{
    height: 400px;
    width:800px;
    background-color: #eb7676;
    display: flex;
    overflow: hidden;
    position: relative;
    margin: 100px auto;
    .picture{
        position: absolute;
        display: flex;
        left:v-bind(content);
        .all-img{
        display: flex;
        left: 0;
        
        img{
           
           width: 800px;
           height: 400px;
           object-fit: cover; 
        //    
           
        }
        
    }
    }

    
    .active{
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
    .left{
        left: 0;  
    }
    .right{
        right: 0;
    }
    .all-item{
        position: absolute;
        width: 800px;
        height: 50px;
        color: #000;
        display: flex;
        bottom: 0;
        justify-content: center;
        align-items: center;
        li{
            width: 20px;
            height: 20px;
            font-size: 30px;
            
        }
    }

}
</style>