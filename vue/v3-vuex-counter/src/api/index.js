
import http from './http.js'
//接口业务  
export async function getBannerData(){
    //http?模块化的http请求对象
    const {banners} = await http.get('/banner',{type:1})
    return banners
}