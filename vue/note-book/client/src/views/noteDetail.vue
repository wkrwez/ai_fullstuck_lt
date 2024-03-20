<template>
    <div class="note-detail">
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
    </div>


</template>

<script setup>
import { onMounted,ref } from 'vue';
import axios from '@/api'
import {useRoute} from 'vue-router'

const route = useRoute()
// console.log(route.query.id);
const pRef = ref(null)
//笔记内容
const list = ref([])


onMounted(async()=>{
    const res = await axios.get('/findNoteDetailById',{
        params:{
            note_id:route.query.id
        }
    }).then(res=>{
        console.log(res.data[0]);
        list.value = res.data[0]
    })
})

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
}
</style>