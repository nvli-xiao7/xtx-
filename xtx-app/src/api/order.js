// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 * 生成订单(即填写订单或结算页)
 * @returns
 */
export const findCheckoutInfo = () => {
  return request({
    url: '/member/order/pre',
    method: 'GET'
  })
}
/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (formData) => {
  return request({
    url: '/member/address',
    method: 'POST',
    data: { ...formData }
  })
}
/**
 * 编辑收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (formData) => {
  return request({
    url: `/member/address/${formData.id}`,
    method: 'PUT',
    data: { ...formData }
  })
}
/**
 * 删除地址信息
 * @param DELETE - 地址id
 */
export const editDelete = (id) => {
  return request({
    url: `/member/address/${id}`,
    method: 'DELETE'
  })
}
