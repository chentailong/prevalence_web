import request from "@/utils/request";

export function list() {
  return request({
    url: `/shoppingCart/list`,
    method:'get',
  })
}


export function clean() {
  return request({
    url: `/shoppingCart/clean`,
    method:'delete',
  })
}

export function del(ids) {
  return request({
    url: '/shoppingCart/del',
    method: 'delete',
    params: {ids}
  })
}

export function addCart(data) {
  return request({
    url: '/shoppingCart/add',
    method: 'post',
    data
  })
}

export function updateCart(params) {
  return request({
    url: '/shoppingCart',
    method: 'put',
    data: {...params}
  })
}



