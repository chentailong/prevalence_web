import request from '@/utils/request'

//登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

//退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

//注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

//判断用户是否存在
export function list(data) {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      username: data
    }
  })
}


//分页查询住户
export function page(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}

//分页查询住户
export function pageAdmin(params) {
  return request({
    url: '/user/pageAdmin',
    method: 'get',
    params
  })
}


//删除用户
export function deleteUser(id) {
  return request({
    url: '/user',
    method: 'delete',
    params: {id}
  })
}

export function userInfo(id) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: {id}
  })
}


//修改用户状态
export function updateStatus(params) {
  return request({
    url: '/user',
    method: 'put',
    data: {...params}
  })
}

// 修改用户信息
export function editUser(params) {
  return request({
    url: '/user',
    method: 'put',
    data: {...params}
  })
}

// 新增用户
export function addUser(params) {
  return request({
    url: '/user',
    method: 'post',
    data: {...params}
  })
}


