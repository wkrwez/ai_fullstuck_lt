<template>
  <SimpleHeader title="购物车" :back="false" />
  <div class="cart-box">
    <div class="cart-body">
      <van-checkbox-group v-model="result" @change="groupChange"> <!-- 复选框 -->
        <van-swipe-cell v-for="(item, index) in list " :key="index">
          
          <van-checkbox :name="item.cartItemId"></van-checkbox>

          <van-card :num="item.goodsCount" :price="item.sellingPrice" :title="item.goodsName" class="goods-card"
            :thumb="item.goodsCoverImg">
            
            <template #footer>
              <van-stepper v-model="item.goodsCount" step="1" max="5" :name="item.cartItemId" @change="numChange" />
            </template>
          </van-card>

          <template #right>
            <van-button @click="deleteGoods(item.cartItemId)" square text="删除" type="danger" class="delete-button" />
          </template>

        </van-swipe-cell>
      </van-checkbox-group>


    </div>
<!-- 提交订单 -->
    <van-submit-bar :price="totalPrice*100" button-text="提交订单" @submit="onSubmit">
      <van-checkbox v-model="checkAll" class="check-all" @click="allCheck">全选</van-checkbox>
    </van-submit-bar>
    <NavBar />


  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import SimpleHeader from '../components/SimpleHeader.vue'; //将父组件里面的title拿进来复用
import { ref, onMounted,computed } from 'vue';
import { getCart,modifyCart,deleteCartItem } from '../api/cart';  //后端请求数据
import { useStore } from 'vuex';    //引入仓库


const result = ref([]) //响应式拿到v-model里的数据

const list = ref([]);  //拿到data的值渲染页面

const store = useStore()  //拿到仓库里面的方法

const checkAll = ref(false)

onMounted(async () => {
  await init()
});

//删除购物车的物品逻辑
const init = async() => {
  const { data } = await getCart({ pageNumber: 1 });
  list.value = data
  result.value = data.map(item => item.cartItemId);  //默认选中购物车所有的id
  
};

// 选中商品
const groupChange = () => {
  console.log(result.value);
  checkAll.value = (list.value.length === result.value.length)&&result.value.length>0 ?true:false  //全选后取消一个，checkAll改为false
}

// 修改数量
const numChange = async(value,detail) => {
  const params = {
    cartItemId:detail.name,
    goodsCount:value
  
  }
  await modifyCart(params)
}

  //提交订单
const onSubmit = ()=>{

}

//全选操作
const allCheck =()=>{
  if(!checkAll.value){  //点之后为false，将数组清零
    result.value = []
  }
  else{
    result.value = list.value.map(item => item.cartItemId);
  }
  
}

//删除商品
const deleteGoods=async(id)=>{
  await deleteCartItem(id)
  init() 
  store.dispatch('setCartCountAction') 


}

 //计算属性中的依赖变量有变动时
const totalPrice = computed(() => {
    let _list = list.value.filter((item)=>  //filter过滤满足条件的，传（item,index）
      result.value.includes(item.cartItemId))
      const allPrice = _list.reduce((pre,item,index,arr)=>{  //reduce函数会把数组遍历，pre是初始值，item是当前数组每项的值，index是索引，arr是数组
        return pre+= item.sellingPrice * item.goodsCount     //pre的值初始为传的值，值为上一次遍历后的累加的值
      },0)
      // console.log(_list);
      return allPrice
}); 
</script>

<style lang="less" scoped>
.cart-body {
  margin: 16px 0 100px 0;
  padding-left: 10px;
}
</style>

<style>
.van-swipe-cell__wrapper {
  display: flex;
}

.van-card.goods-card {
  width: 100%;
  background-color: #fff;
}

.van-checkbox {
  width: 23px;
}

.delete-button {
  height: 100%;
}

.van-card__footer {
  position: absolute;
  right: 16px;
  bottom: 8px;
}

.van-card__num {
  position: absolute;
  top: 0;
  right: 0;
}

.simple-header {
  background-color: #fff;
}
.van-submit-bar{
  bottom: 50px;
}
.check-all{
  width: 40%;
}
</style>