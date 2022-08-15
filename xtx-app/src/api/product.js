// 商品详情
// 定义首页需要的接口函数
import request from '@/utils/request'
/**
 * 获取商品详情
 * @param {String} id - 商品ID
 */
export const getGoods = (id) => {
  return request({
    url: '/goods',
    method: 'GET',
    params: { id }
  })
}
