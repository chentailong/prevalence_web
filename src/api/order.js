import request from '@/utils/request'

export function addOrderApi(data) {
  return request({
    'url': '/order/submit',
    'method': 'post',
    data
  })
}

export function page(params) {
  return request({
    'url': '/order/pages',
    'method': 'get',
    params
  })
}

export function AllPage(params) {
  return request({
    'url': '/order/allPages',
    'method': 'get',
    params
  })
}

export function list(params) {
  return request({
    'url': '/orderDetail/list',
    'method': 'get',
    params
  })
}

export function update(params) {
  return request({
    url: '/order/update',
    method: 'put',
    data: {...params}
  })
}
