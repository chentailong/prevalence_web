import request from '@/utils/request'

/**
 * 查询数据列表
 * @param params
 * @returns {AxiosPromise}
 */
export function page(params) {
  return request({
    url: '/category/page',
    method: 'get',
    params
  })
}

/**
 * 删除分类
 * @param id
 * @returns {AxiosPromise}
 */
export function del(id) {
  return request({
    url: '/category',
    method: 'delete',
    params: {id}
  })
}

/**
 * 修改分类信息
 * @param params
 * @returns {AxiosPromise}
 */
export function update(params) {
  return request({
    url: '/category',
    method: 'put',
    data: {...params}
  })
}

/**
 * 新增分类
 * @param params
 * @returns {AxiosPromise}
 */
export function save(params) {
  return request({
    url: '/category/save',
    method: 'post',
    data: {...params}
  })
}

/**
 * 获取分类
 * @param params
 * @returns {AxiosPromise}
 */
export function list(params) {
  return request({
    url:'/category/list',
    method:'get',
    params
  })
}


