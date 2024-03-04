<template>
    <div class="all">
    <div class="content">
            <div class="header">插座/插排</div>
            <div class="wiring">
                <div class="equip" v-for="item in state.switchList.equipmentList">
                    <img :src="state.switchList.equipmentList && item.img" alt="">
                    <div class="desc">{{ item.describe }}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

import { apiGetSwitchList } from '../../api/index';
import { reactive,onMounted } from 'vue';

const state = reactive({
    switchList:[]
})

onMounted(() => {
    getSwitchList();
})

const getSwitchList =async()=>{
    const res = await apiGetSwitchList()
    state.switchList = res.data;
    console.log(state.switchList);
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
                width: 2rem;
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