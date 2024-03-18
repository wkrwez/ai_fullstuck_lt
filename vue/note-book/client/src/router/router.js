import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {   
        redirect:'/home',
        path:'/home',
        component:()=>import('@/views/Home.vue')
    },
    {
        path: '/login',
        component: () => import('@/views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router