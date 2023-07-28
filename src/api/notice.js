import request from '@/utils/request'

/**
 * 获取公告信息
 * */
export function page(params) {
  return request({
    url: '/notice/page',
    method: 'get',
    params
  })
}

/**
 * 修改公告信息
 * */
export function update(params) {
  return request({
    url: '/notice',
    method: 'put',
    data:  {...params}
  })
}

/**
 * 新增公告信息
 * */
export function save(data) {
  return request({
    url: '/notice/save',
    method: 'post',
    data
  })
}

/**
 * 删除公告信息
 */
export function del(id) {
  return request({
    url: '/notice/del',
    method: 'delete',
    params: {id}
  })
}
