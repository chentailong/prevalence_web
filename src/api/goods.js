import request from '@/utils/request'

/**
 * 获取物资信息
 * */
export function page(params) {
  return request({
    url: '/goods/page',
    method: 'get',
    params
  })
}

/**
 * 新增物资
 * @param data
 * @returns {AxiosPromise}
 */
export function save(data) {
  return request({
    url: '/goods/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/goods/del',
    method: 'delete',
    params: {ids}
  })
}

/**
 * 修改信息
 * @param params
 * @returns {AxiosPromise}
 */
export function edit(params) {
  return request({
    url: '/goods',
    method: 'put',
    data: {...params}
  })
}

/**
 * 修改状态
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function statusUpdate(params) {
  return request({
    url: `/goods/status/${params.status}`,
    method:'post',
    params: {ids: params.id}
  })
}

export function list() {
  return request({
    url: `/goods/list`,
    method:'get',
  })
}


