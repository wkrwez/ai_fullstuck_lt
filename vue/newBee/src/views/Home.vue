<template>
  <div class="home">
    <header class="home-header" :class="{'active':state.headerActive}">
      <router-link to="#">
        <i class="iconfont icon-menu"></i>
      </router-link>

      <div class="header-search">
        <span class="app-name">喜仔超市</span>
        <i>|</i>
        <router-link to="#" class="search-title">欢迎进店</router-link>
      </div>

      <router-link to="/login" class="login">登录</router-link>

    </header>

    <Swiper id="test" :list="state.swiperList" />

    <div class="category-list">
      <div v-for="item  in state.categoryList" :key="item.categoryList" @click="goDetail(item.name)">
        <img :src="item.imgUrl" alt="">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 传一个数组给子组件 ,用一个子组件接收同一个页面-->
    <GoodsList :list="state.newGoodsList" title="新品上线"/>  
    <GoodsList :list="state.HotList" title="热门商品"/>
    <GoodsList :list="state.RecomList" title="最新推荐"/>
    <NavBar />

    <!-- footbar -->
    <!-- rest -->
  </div>
</template>

<script setup>
import Swiper from '../components/Swiper.vue';
import GoodsList from '../components/GoodsList.vue';
import NavBar from '../components/NavBar.vue'
import { onMounted, reactive ,nextTick} from 'vue'
import { getHome } from '@/api/home.js'
import { showToast } from 'vant';

const goDetail = (name)=>{
  showToast(name);
}

const state = reactive({ // state是被reactive修饰过的对象，也就是响应式对象
  swiperList: [],
  categoryList: [
        {
          name: '新蜂超市',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
          categoryId: 100001
        }, {
          name: '新蜂服饰',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
          categoryId: 100003
        }, {
          name: '全球购',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
          categoryId: 100002
        }, {
          name: '新蜂生鲜',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
          categoryId: 100004
        }, {
          name: '新蜂到家',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
          categoryId: 100005
        }, {
          name: '充值缴费',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
          categoryId: 100006
        }, {
          name: '9.9元拼',
          imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
          categoryId: 100007
        }, {
          name: '领劵',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
          categoryId: 100008
        }, {
          name: '省钱',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
          categoryId: 100009
        }, {
          name: '全部',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
          categoryId: 100010
        }
      ],
      newGoodsList:[],
      HotList:[],
      RecomList:[],
      headerActive:false

})


// 请求banner数据
onMounted(async () => {
  const { data } = await getHome()
  console.log(data);
  state.swiperList = data.data.carousels
  state.newGoodsList = data.data.newGoodses
  state.HotList = data.data.hotGoodses
  state.RecomList = data.data.recommendGoodses
})

nextTick(()=>{//写在里面的逻辑一定会在页面加载完毕后执行
  document.body.addEventListener('scroll',function(){
    this.scrollTop > 100? state.headerActive = true : state.headerActive = false
  })
})
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';

.home {
  padding-bottom: 100px;

  .home-header {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 15px;

    &.active {
      background-color: @primary;

      .icon-menu {
        color: #fff;
      }

      .login {
        color: #fff;
      }
    }

    .icon-menu {
      color: @primary;
    }

    .header-search {
      .wh(74%, 20px);
      padding: 5px 0;
      line-height: 20px;
      color: #232326;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 20px;
      display: flex;
      align-items: center;

      .app-name {
        color: @primary;
        padding: 0 10px;
        font-size: 20px;
        font-weight: bold;
      }

      .search-title {
        font-size: 14px;
        padding: 0 10px;
      }
    }

    .login {
      color: @primary;
      font-size: 16px;
    }
  }
  .category-list{
    //网格布局
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-row-gap: 5px;  //行间距
    // flex-wrap: wrap; //单行显示并换行
    div{
      display: flex;
      flex-direction: column;
      // justify-content: center; 弹性容器主轴方向居中
      align-items: center; 
      img{
        
        .wh(36px,36px);
        margin: 13px 0 8px 0;
      }
    }
  }

}</style>