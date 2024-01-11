<template>
    <van-action-bar>
        <van-action-bar-icon icon="chat-o" text="客服" />
        <van-action-bar-icon icon="cart-o" text="购物车" :badge='badgeNum' v-if="badgeNum>0"/>
        <van-action-bar-icon icon="cart-o" text="购物车" v-else />
        <van-action-bar-button  type="warning" text="加入购物车" @click="handleAddCart"/>
        <van-action-bar-button type="danger" text="立即购买" />
    </van-action-bar>
</template>

<script setup>
import {useStore} from 'vuex'
import { computed ,onMounted} from 'vue';
import {addCart} from '@/api/cart.js'
import { showSuccessToast, showFailToast } from 'vant';

const props=defineProps({
    id: String
})
    
    
  

const store = useStore()

const badgeNum = computed(() => {
  
       return store.state.cartCount;
    
    
})

onMounted(()=>{
    store.dispatch('setCartCountAction') //dispatch:触发仓库里面Actions里面的方法
})

const handleAddCart =async ()=>{
   const res =await addCart({goodsCount:1,goodsId:props.id})  //会把数据加入到后端里面
    // console.log(res);
//    console.log(res);
    if(res.resultCode === 200){
        showSuccessToast('加入购物车成功')
        store.dispatch('setCartCountAction')
    }
}

</script>

<style lang="less" scoped>

</style>
<style>
.van-button--warning{
    background: linear-gradient(to right,#6bd8d8,#1baeae);
}
.van-button--danger{
    background:linear-gradient(to right,#0dc3c3,#098888);
}
</style>