import {createRouter,createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'   //../是上一层文件夹

const routes = [
    {   //点开就自动跳转到home
        path:'/' ,
        redirect:'/home'
    },
    {   
        path:'/home',
        component:Home,
        children:[
            {
                path:'',  //路由重定向  自动跳转到suggest推荐 
                redirect:'/home/suggest'
            },
            {
                path:'/home/suggest',
                component:()=>import('@/views/homeChild/Suggest.vue')//@代表src文件
            },
            {
                path:'/home/newest',   //二级路由加/就要加上他的上一级,也可以不加
                component:()=>import('@/views/homeChild/Newest.vue')//@代表src文件
            }
        ]
    },
    {
        path:'/hot',
        component:()=>import('../views/Hot.vue')//引入hot文件
    },
    {
        path:'/class/:id',  //用name传参就要说明这里可以传参,传两个参得在后面接/:name
        name:'class',
        component:()=>import('../views/Class.vue')//引入hot文件
    }
]

const router = createRouter({
    routes,
    history: createWebHistory() //路由模式
})

export default router
