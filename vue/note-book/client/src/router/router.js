import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {   
        path:'/noteClass',
        component:()=>import('@/views/Home.vue')
    },
    {
        path: '/login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router