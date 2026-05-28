<template>
  <div id="app">
    <button @click="change">change</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      data: Object.freeze({
        name: "1",
        id: 1,
        age: 1,
        children: {
          name: "2",
          id: 2,
          age: 2,
          children: [
            {
              name: "3",
              id: 3,
              age: 3,
            },
          ],
        },
      }),
    };
  },
  methods: {
    change() {
      console.log(this.data);
    },
  },
};
</script>

<style></style>
