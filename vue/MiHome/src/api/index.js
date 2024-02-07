import axios from './request.js'



//添加设备


// 摄影机
export function apiGetPhotoList(params) {
    return axios.get('/add/equip-photo', params)
  }

// 电源开关
export function apiGetSwitchList(){
  return axios.get('/add/equip-switch')
}

//灯
export function apiGetLightList(){
  return axios.get('/add/equip-light')
}

//   // 获取用户详情
//   getUserDetail (params) {
//     return baseUrl.get('/user/detail', params)
//   },
//   // 获取用户列表
//   getUserList (params) {
//     return baseUrl.get('/user/list', params)
//   },
  // 获取用户详情
