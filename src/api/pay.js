import request from "@/utils/request";

export function alipay(data) {
  return request({
    'url': 'pay/alipay',
    "method": 'post',
    data
  })
}

export function pay(data) {
  return request({
    'url': 'alipay/createQR',
    "method": 'post',
    data
  })
}

