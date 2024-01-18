import { createRouter,createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
    {
    path:'/',
    redirect:'/home'
    },
    {
        path:'/home',
        name:'home',
        component:Home
    },
    {
        path:'/sort',
        name:'sort',
        component:()=>import('../views/Sort.vue')
    },
    
   ]

   const router = createRouter({
   history: createWebHistory(),
   routes:routes
   })
   export default router