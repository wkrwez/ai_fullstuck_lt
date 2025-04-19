<template>
  <div>
    {{ state.deep.count }}
    <!-- <h1>Hello World</h1>
    <div style="height: 1000px"></div>
    <ul class="image-container">
      <li class="image-item" v-for="image in images" :key="image.id">
        <img v-lazy="image.url" class="image-lazy" alt="Image" />
        <p>{{ image.title }}</p>
      </li>
    </ul> -->
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
const state = reactive({});
state.deep = { count: 0 };
state.deep.count = 3;
setTimeout(() => {
  state.deep.count = 3;
}, 1000);

// const images = ref([
//   {
//     id: 1,
//     url: "https://picsum.photos/id/237/200/300",
//     title: "Image 1",
//   },
//   {
//     id: 2,
//     url: "https://picsum.photos/id/237/200/300",
//     title: "Image 2",
//   },
// ]);
</script>

<style scoped></style>
