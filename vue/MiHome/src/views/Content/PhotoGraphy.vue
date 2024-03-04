<template>
    <div class="all">
    <div class="content">
            <div class="header">摄影机</div>
            <div class="wiring" >
                <div class="equip" v-for="item in state.equipList.equipmentList" :key="item.id"  >
                    <img :src="state.equipList.equipmentList && item.img " alt="">
                    <div class="desc">{{ item.describe }}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref ,onMounted,reactive} from 'vue';
import {apiGetPhotoList} from '../../api/index.js'
const state = reactive({
    equipList:[]
})

onMounted(()=>{
    getPhotoList();
})

const getPhotoList = async()=>{
    const res =  await apiGetPhotoList()
        // console.log(res);
        state.equipList = res.data;
        // console.log(state.equipList);
   
}
</script>

<style lang="less" scoped>
.all{
    width: 100%;
    display: flex;

.content {
        width: 100%;
        margin: 0 0.5rem 0 0.5rem;
        .header{
            width: 100%;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.3rem;
        }
        .wiring {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-column-gap: 0.2rem;
            .equip {
                
                height: 3rem;
                text-align: center;
                margin-bottom: 0.2rem;
                

                img {
                    width: 1.6rem;
                    height: 2rem;
                    margin-bottom: 0.2rem;
                }

                .desc {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    width: 2rem;
                    font-size: 0.3rem;

                }
            }
        }
    }
}
</style>