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
