import request from "@/utils/request";

/**
 * 获取商品，住户，访客，返乡人数
 * @returns {AxiosPromise}
 */
export function userCount() {
  return request({
    url: '/user/count',
    method: 'get'
  })
}

export function goHomeCount() {
  return request({
    url: '/goHome/count',
    method: 'get'
  })
}

export function visitorCount() {
  return request({
    url: '/visitor/count',
    method: 'get'
  })
}

export function goodsCount() {
  return request({
    url: '/goods/count',
    method: 'get'
  })
}

/**
 * 获取公告内容
 * @returns {AxiosPromise}
 */
export function noticeList() {
  return request({
    url: '/notice/list',
    method: 'get'
  })
}
