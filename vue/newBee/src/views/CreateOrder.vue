<template>
    <div class="create-order">
        <SimpleHeader title="生产订单" />

        <div class="address-wrap" @click="goAddress">
            <div class="name">
                <span>{{state.address.userName}}</span>
                <span>{{state.address.userPhone}}</span>
            </div>
            <div class="address">
                {{state.address.provinceName}}{{state.address.cityName}}{{state.address.regionName}}{{state.address.detailAddress}}
            </div>
            <van-icon name="arrow" class="arrow" />
        </div>

        <div class="goods-list">
            <van-card 
                :num="item.goodsCount" 
                :price="item.sellingPrice" 
                :title="item.goodsName"
                :thumb="item.goodsCoverImg" 
                v-for="item in state.cartList"
                :key="item.cartItemId"
            />
        </div>

        <div class="pay-wrap">
            <div class="price">
                <span>商品金额</span>
                <span>￥{{totalPrice}}</span>
            </div>
            <van-button type="primary" block>生成订单</van-button>
        </div>
    </div>
</template>

<script setup>
import SimpleHeader from '../components/SimpleHeader.vue';
import { useRoute, useRouter } from 'vue-router'
import { getCartItemIds } from '@/api/cart.js'
import { onMounted, reactive, computed } from 'vue'
import { getAddressDetail } from '@/api/address.js'

const route = useRoute()
const router = useRouter()
const state = reactive({
    cartList: [],
    address: {}
})

// console.log(route.query.cartItemIds);

onMounted(async() => {
    const cartItemIds = route.query.cartItemIds
    const _cartItemIds = cartItemIds ? JSON.parse(cartItemIds) : JSON.parse(localStorage.getItem('cartItemIds'))
    localStorage.setItem('cartItemIds', JSON.stringify(_cartItemIds))
    // console.log(_cartItemIds);
    const { data: list } = await getCartItemIds({cartItemIds: _cartItemIds.join(',')})
    // console.log(list);
    state.cartList = list

    // 从地址页面调过来
    const addressId = route.query.addressId
    const { data: address } = await getAddressDetail(addressId)
    console.log(address);
    state.address = address

})

const totalPrice = computed(() => {
    return state.cartList.reduce((total, item) => {
        return total += item.goodsCount * item.sellingPrice;
    }, 0);

})

const goAddress = () => {
    router.push({ path: '/address' })
}

</script>

<style lang="less" scoped>
.create-order {
    background: #f9f9f9;

    .address-wrap {
        background: #fff;
        margin-bottom: 20px;
        font-size: 14px;
        padding: 15px;
        position: relative;

        // border-bottom: 2px dotted #000;
        .name {
            margin: 10px 0;
        }

        .arrow {
            // float: right;
            // margin-top: -30px;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }

        &::after {
            content: '';
            width: 100%;
            height: 2px;
            display: block;
            background: repeating-linear-gradient(-45deg, #ff6c6c 0%, #ff6c6c 20%, transparent 0%, transparent 25%, #1989fa 0%, #1989fa 45%, transparent 0%, transparent 50%, );
            position: absolute;
            bottom: 0;
            left: 0;
            background-size: 80px;
        }
    }
    .goods-list{
        margin-bottom: 120px;
    }
    .pay-wrap{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        padding: 10px 20px;
        box-sizing: border-box;
        border-top: 1px solid #e9e9e9;
        .price{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin: 10px 0;
            span:nth-child(2){
                color: red;
                font-size: 18px;
            }
        }
    }
}
</style>
<style>
.goods-list .van-card{
    background: #fff;
}
</style>