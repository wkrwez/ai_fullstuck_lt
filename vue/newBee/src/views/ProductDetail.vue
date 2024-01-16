<template>
  <div>
    <SimpleHeader :title="'商品详情'"/>

    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" indicator-color="#1baeae">
          <van-swipe-item v-for="(item, index) in state.detail.goodsCarouselList" :key="index">
            <img :src="item" alt="">
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="product-title">{{state.detail.goodsName}}</div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">￥{{state.detail.sellingPrice}}</div>
      </div>
      <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
      </div>
      <div class="product-content" v-html="state.detail.goodsDetailContent"></div>
    </div>

    <FooterBar :id="route.query.id" />
  </div>
</template>

<script setup>
import SimpleHeader from '../components/SimpleHeader.vue';
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue';
import { getDetail } from '@/api/goods.js'
import FooterBar from '../components/FooterBar.vue'

const route = useRoute()  // 当前页面url的详细描述
const router = useRouter()  // 路由的实例对象
const state = reactive({
  detail: {}
})


onMounted(async() => {
  // 从url上取到id值，将商品的id传给后端，获取该商品的详细信息
  const { query: { id } } = route
  const { data } = await getDetail(id)
  console.log(data);
  state.detail = data
})
</script>

<style lang="less" scoped>
.detail-content{
  height: calc(100vh - 44px);
  overflow: scroll;
  .detail-swipe-wrap{
    .my-swipe{
      img{
        width: 100%;
      }
    }
  }
  .product-info{
    padding: 0 10px;
    .product-title{
      font-size: 18px;
      color: #333;
    }
    .product-desc{
      font-size: 14px;
      color: #999;
      padding: 10px 0;
    }
    .product-price{
      color: #f63515;
      font-size: 22px;
    }
  }
  .product-intro{
    width: 100%;
    padding-bottom: 50px;
    overflow: auto;
    ul{
      display: flex;
      margin: 10px 0;
      li{
        flex: 1;
        font-size: 15px;
        padding: 5px 0;
        text-align: center;
        border-right: 1px solid #999;
        &:last-child{
          border-right: none;
        }
      }
    }
  }
  .product-content{
    padding: 0 20px;
    img{
      width: 100%;
    }
  }
}
</style>