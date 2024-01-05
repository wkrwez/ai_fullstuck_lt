import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  
  {
    path: '/category',
    name: 'category',
    component: ()=>import('@/views/Category.vue')   //路由的懒加载
  },
  {
    path: '/cart',
    name: 'cart',
    component: ()=>import('@/views/Cart.vue')   //路由的懒加载
  },
  {
    path: '/user',
    name: 'user',
    component: ()=>import('@/views/User.vue')   //路由的懒加载
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router