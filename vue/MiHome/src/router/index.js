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
        redirect:'/sort/photoGraphy',
        name:'sort',
        component:()=>import('../views/Sort.vue'),
        children:[
            {
                path:'photoGraphy',
                component:()=>import( '../components/Content/PhotoGraphy.vue')
            },
            {
                path:'switc',
                component:()=>import('../components/Content/Switc.vue'),
            },
            {
                path:'light',
                component:()=>import('../components/Content/Light.vue'),
            }
        ]
    },
    {
        path:'/quality',
        name:'quality',
        component:()=>import('../views/Quality.vue')
    },
    {
        path:'/invalid',
        name:'invalid',
        component:()=>import('../views/Invalid.vue')
    },{
        path:'/mine',
        name:'mine',
        component:()=>import('../views/Mine.vue')
    }
   ]

   const router = createRouter({
   history: createWebHistory(),
   routes:routes
   })
   export default router