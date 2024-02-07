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
        width: 252px;
        margin-left: 10px;
        .header{
            width: 100%;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .wiring {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-column-gap: 5px;

            .equip {
                width: 80px;
                height: 100px;
                text-align: center;
                margin-bottom: 10px;

                img {
                    width: 60px;
                    height: 70px;
                    margin-bottom: 5px;
                }

                .desc {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    width: 80px;

                }
            }
        }
    }
}
</style>