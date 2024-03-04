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
                component:()=>import( '../views/Content/PhotoGraphy.vue')
            },
            {
                path:'switc',
                component:()=>import('../views/Content/Switc.vue'),
            },
            {
                path:'light',
                component:()=>import('../views/Content/Light.vue'),
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
        redirect:'/invalid/recommend',
        component:()=>import('../views/Invalid.vue'),
        children:[
            {
                path:'recommend',
                component:()=>import('../views/Content/Recommend.vue')
            },
            {
                path:'mined',
                component:()=>import('../views/Content/Mined.vue')
            },
            {
                path:'log',
                component:()=>import('../views/Content/Log.vue')
            
            }
        ]

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