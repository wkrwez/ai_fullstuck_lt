import axios from './axios.js';

export function getHome() {
  return axios.get('/index-infos')
}

