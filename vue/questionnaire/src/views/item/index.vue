<template>
    <div>
       <ItemContainer parentComponent="item"/>
        
    </div>
</template>

<script>
import ItemContainer from '@/components/ItemContainer.vue';
import {mapActions} from 'vuex';
    export default {
        components:{
            ItemContainer
        },
        created(){  //在页面加载的过程中自动触发
            this.getQuestionListAction()
        },
        methods:{
            ...mapActions(['getQuestionListAction'])
        }
    }
</script>

<style lang="less" scoped>

</style>