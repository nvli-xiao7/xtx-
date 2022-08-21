import request from '@/utils/request'

/**
 * 获取新的商品信息
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
  return request({
    url: `/goods/stock/${skuId}`,
    method: 'GET'
  })
}
/**
 * 删除购物车商品，支批量
 * @param {Array<string>} ids - skuId 的集合[]
 */
export const deleteCart = (ids) => {
  return request({
    url: '/member/cart',
    method: 'DELETE',
    data: { ids }
  })
}
/**
 *购物车规格
 * @param
 */
export const getSku = (skuId) => {
  return request({
    url: `/goods/sku/${skuId}`,
    method: 'GET'
  })
}
/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
export const mergeLocalCart = (cartList) => {
  return request({
    url: '/member/cart/merge',
    method: 'POST',
    data: cartList
  })
}
/**
 * 获取登录后的购物车列表
 * @returns Promise
 */
export const findCartList = () => {
  return request({
    url: '/member/cart',
    method: 'GET'
  })
}
/**
 * 加入购物车
 * @param {String} skuId - 商品SKUID
 * @param {Integer} count - 商品数量
 * @returns Promise
 */
export const insertCart = ({ skuId, count }) => {
  return request({
    url: '/member/cart',
    method: 'POST',
    data: { skuId, count }
  })
}
/**
 * 购物车全选/取消全选
 * selected boolean
 * ids string []
 */
export const checkAllCart = (selected, ids) => {
  return request({
    url: '/member/cart/selected',
    method: 'PUT',
    data: { selected, ids }
  })
}
/**
 * 获取购物车数量
 */
export const checkCount = ({ skuId, selected, count }) => {
  return request({
    url: `/member/cart/${skuId}`,
    method: 'PUT',
    data: { selected, count }
  })
}
