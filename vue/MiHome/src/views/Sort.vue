<template>
    <NavBar />
    <div class="all">
       
        <div class="page">
            <router-link class="ootd" @click="change(index)" :class="{'active':activeNum ===index}" 
            v-for="(item, index) in list" :key="index" :to="'/sort/'+ item.id "  > {{ item.name }}</router-link>
        </div>   <router-view />     
    

    </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue';


const list = ref([
    {name:'摄影机',id:'photoGraphy'},
    {name:'电源开关',id: 'switc'}, 
    {name:'照明',id: 'light'},
    {name:'家居安防',id: 'safety'},
    {name:'环境电器',id: 'envir'},
    {name:'传感器',id: 'sensor'},
    {name:'厨房电器',id: 'kitchen'},
    {name:'娱乐影音',id: 'recreation'},
    {name:'生活电器',id: 'life'},
    {name:'出行车载',id: 'trip'},
    {name:'运动健康',id: 'sport'},
    {name:'其他',id: 'other'}, 
    
    
   
]);


//选中的列表项
const activeNum = ref(0);
const change = (index) => {
    activeNum.value= index;
    
}



</script>

<style lang="less" scoped>
.all {
    width: 100%;
    height: 100%;
    display: flex;
    .page{
        width: 3rem;
        height: 100%;
        .ootd {
            width: 100%;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(243,243,243);
            color: black;
        }
        .active{
            background-color: #fff;
            color: rgb(87,212,236);
        }
    }
}
</style>