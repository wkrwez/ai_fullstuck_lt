
//判断token是否存在? 允许跳转 ： 重定向login
import {getToken} from '@/utils'
import { Navigate } from 'react-router-dom'


//高阶函数
function AuthRouter({children}){
    const isToken = getToken()

    if(isToken){
        return <>{children}</>
    }else{
        return <Navigate to='/login' replace></Navigate>
    }

}

export {AuthRouter}