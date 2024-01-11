import axios from './axios.js'

export function getDetail(id) {
  return axios.get(`/goods/detail/${id}`)
}