
import baseUrl from './request.js'
//首页的接口请求
export const apiGetBanner = (data)=>{
	return uni.request({  //return 出promise对象
		url:baseUrl + '/banner',  //调用接口
		method:'GET',  //接口样式
		data:data,  //key
		
	})
}

//抛出拿到首页

export const apiGetBall = ()=>{
	return uni.request({
		url:baseUrl+ '/homepage/dragon/ball',
		method:'GET'
	})
}

export const apiGetRecommendList = ()=>{  //推荐歌单
	return uni.request({
		url:baseUrl+'/recommend/resource',
		method:'GET'
	})
}