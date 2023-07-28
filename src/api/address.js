import request from "@/utils/request";

//获取所有地址
export function addressListApi() {
  return request({
    'url': '/addressBook/list',
    'method': 'get',
  })
}


//新增地址
export function addAddressApi(data) {
  return request({
    'url': '/addressBook',
    'method': 'post',
    data
  })
}

//修改地址
export function updateAddressApi(params) {
  return request({
    'url': '/addressBook',
    'method': 'put',
    data: {...params}
  })
}

//删除地址
export function deleteAddressApi(id) {
  return request({
    'url': '/addressBook/del',
    'method': 'delete',
    params: {id}
  })
}

//查询单个地址
export function addressFindOneApi(id) {
  return request({
    'url': `/addressBook/${id}`,
    'method': 'get',
  })
}

//设置默认地址
export function setDefaultAddressApi(params) {
  return request({
    'url': '/addressBook/default',
    'method': 'put',
    data: {...params}
  })
}

//获取默认地址
export function getDefaultAddressApi() {
  return request({
    'url': `/addressBook/default`,
    'method': 'get',
  })
}
