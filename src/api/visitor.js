import request from '@/utils/request'

/**
 * 查询访客信息
 * @param params
 * @returns {AxiosPromise}
 */
export function page(params) {
  return request({
    url: "/visitor/page",
    method: 'get',
    params
  })
}

/**
 * 删除访客信息
 * @param id
 * @returns {AxiosPromise}
 */
export function del(id) {
  return request({
    url: '/visitor/del',
    method: 'delete',
    params: {id}
  })
}

/**
 * 新增访客信息
 * @param data
 * @returns {AxiosPromise}
 */
export function save(data) {
  return request({
    url:'/visitor/save',
    method:'post',
    data
  })
}


/**
 * 修改返乡信息
 * @param params
 * @returns {AxiosPromise}
 */
export function update(params) {
  return request({
    url: '/visitor',
    method: 'put',
    data:  {...params}
  })
}

