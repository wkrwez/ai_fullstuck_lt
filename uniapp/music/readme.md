# 父子组件通信
子组件向父组件通信和vue里面的方法相同，但是当父组件想添加一个值在子组件则需要添加一个插槽
子组件：<slot name="content"></slot>
父组件：<template v-slot:content>内容</template>


process.env.NODE_ENV //读取开发环境


post  get以问号拼接参数