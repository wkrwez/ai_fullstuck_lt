import axios from './axios.js';

export function getHome() {
  //作者后端接口
  return axios.get('/index-infos')
}

