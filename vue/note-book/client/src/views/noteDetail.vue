<template>
  
    <div class="note-detail">
      <Back/>
        <div class="note-img">
            <img :src="list.head_img" alt="">
        </div>
        <div class="note-content">
            <div class="tab">
                <span class="note_type">{{ list.note_type }}</span>
                <span class="author">{{ list.nickname }}</span>
            </div>
            <p class="title">{{list.title}}</p>
            <div class="content" v-html="list.note_content"></div>
        </div>
        <div class="edit" @click="goEdit">
          <van-icon name="records-o" size = "30"/>
        </div>
    </div>
    


</template>

<script setup>
import { onMounted,ref } from 'vue';
import axios from '@/api'
import {useRoute,useRouter} from 'vue-router'
import Back from  '../components/Back.vue';

const router = useRouter()
const route = useRoute()
// console.log(route.query.id);
const pRef = ref(null)
//笔记内容
const list = ref([])

//通过id拿到需要展示的笔记详情
onMounted(async()=>{
    const res = await axios.get('/findNoteDetailById',{
        params:{
            id:route.query.id
        }
    }).then(res=>{
        console.log(res.data);
        list.value = res.data
    })
})

//编辑修改笔记
const goEdit = ()=>{
  router.push({path:'/notePublish',query:{id:route.query.id}})
}
</script>

<style lang="less" scoped>
.note-detail {
  .note-img {
    width: 100%;
    height: 5rem;
    // overflow: hidden;
    background-color: #795e5e;
    img{
        object-fit:contain;
        height: 5rem;
    }
    
    

    img {
      width: 100%;
    }
  }

  .note-content {
    padding: 0.667rem;

    .tab {
      display: flex;
      justify-content: space-between;
      color: rgba(16, 16, 16, 0.7);
      font-size: 0.48rem;

      span {
        padding-bottom: 4px;
        border-bottom: 2px solid #e51c23;
      }
    }

    .title {
      margin: .5333rem 0;
      line-height: 1.3;
      color: rgba(16, 16, 16, 1);
      font-size: 0.8rem;
    }

    .content {
      line-height: 1.5;
      color: rgba(16, 16, 16, 1);
      font-size: 0.3733rem;
    }
  }
  .edit{
    position: fixed;
    right: 10px;
    bottom: 50px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(16,16,16,0.3);
    box-shadow: 0 0 5px #aaa;
    text-align: center;
    line-height: 50px;
  }
}
</style>