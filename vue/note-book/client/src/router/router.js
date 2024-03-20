import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {   
        path:'/noteClass',
        component:()=>import('@/views/Home.vue'),
        meta:{
            title:'首页'
        }
    },
    {
        path: '/login',
        component: () => import('@/views/Login.vue'),
        meta:{
            title:'登陆'
        }
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue'),
        meta:{
            title:'注册'
        }
    },
    {
        path: '/noteList',
        component: () => import('@/views/noteList.vue'),
        meta:{
            title:'笔记列表'
        }
    },
    {
        path: '/noteDetail',
        component: () => import('@/views/noteDetail.vue'),
        meta:{
            title:'笔记详情'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


//路由守卫,必须登陆
const whitePath = ['/login','/register']
router.beforeEach((to,from,next)=>{
    // console.log(to);
    if(!whitePath.includes(to.path)){
        //看本地存储
        if(!localStorage.getItem('userInfo')){
            router.push('/login')
            return 
        }
    }
    document.title = to.meta.title
    next()
})




export default router