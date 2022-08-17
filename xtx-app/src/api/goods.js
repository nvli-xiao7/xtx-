// 定义首页需要的接口函数
// 商品推荐
import request from '@/utils/request'
/**
 * 同类推荐(也支持猜你喜欢)
 */
export const findRelGoods = (id, limit = 16) => {
  return request({
    url: '/goods/relevant',
    method: 'GET',
    params: { id, limit }
  })
}
/**
 * 热销推荐
 */
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return request({
    url: '/goods/relevant',
    method: 'GET',
    params: { id, type, limit }
  })
}

/**
 * 商品的好评信息，6个框
 */
export const findCommentInfoByGoods = (id) => {
  return request({
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    method: 'GET'
  })
}
/**
 * 商品的评价信息
 */
export const findEvaluate = (id, { ...reqParams }) => {
  return request({
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    method: 'GET',
    params: { reqParams }
  })
}
