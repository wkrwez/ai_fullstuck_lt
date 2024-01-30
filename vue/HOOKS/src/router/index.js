import {createRouter ,createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta:{
            title:'首页'
        
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta:{
            title:'关于'
        
        },
        //独享守卫
        // beforeEnter:(to,from,next)=>{
        //     next()
        // }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes

})

//全局的前置钩子  起跳前
// router.beforeEach((to,from,next)=>{
//     document.title = to.meta.title //标题

//     //判断是否登陆
//     if(to.path !== '/'){
//         const isLogin = localStorage.getItem('isLogin')
//         if(isLogin){
//             next()
//         }else{
//             // router.push('/login')
//             alert('请先登陆')
//             return 
//         }
//     }
//     next()
// })

//跳跃过程
// router.beforeResolve((to,from,next)=>{
    
// })

//全局的后置钩子,落地
// router.afterEach(()=>{

// })

export default router