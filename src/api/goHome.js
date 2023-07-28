import request from '@/utils/request'

/**
 * 查询返乡信息
 * @param params
 * @returns {AxiosPromise}
 */
export function page(params) {
  return request({
    url: "/goHome/page",
    method: 'get',
    params
  })
}

/**
 * 删除返乡信息
 * @param id
 * @returns {AxiosPromise}
 */
export function del(id) {
  return request({
    url: '/goHome/del',
    method: 'delete',
    params: {id}
  })
}

/**
 * 新增返乡信息
 * @param data
 * @returns {AxiosPromise}
 */
export function save(data) {
  return request({
    url:'/goHome/save',
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
    url: '/goHome',
    method: 'put',
    data:  {...params}
  })
}
