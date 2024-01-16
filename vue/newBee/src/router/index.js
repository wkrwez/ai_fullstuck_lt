import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home' //路由重定向
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/Category.vue') // 路由的懒加载
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User.vue')
  },
  {
    path: '/product',
    name: 'product',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/create-order',
    name: 'create-order',
    component: () => import('@/views/CreateOrder.vue')
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address.vue')
  },
  {
    path: '/address-edit',
    name: 'address-edit',
    component: () => import('@/views/AddressEdit.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router