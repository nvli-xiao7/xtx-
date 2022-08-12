// 定义首页需要的接口函数
import request from '@/utils/request'

// 左边品牌分类
export const findBrand = (limit) => {
  return request({
    url: '/home/brand',
    method: 'GET',
    params: { limit }
  })
}
// 中间轮播图广告
export const findBanner = () => {
  return request({
    url: '/home/banner',
    method: 'GET'
  })
}
// 新鲜好物数据
export const findNew = () => {
  return request({
    url: '/home/new',
    method: 'GET'
  })
}
// 人气推荐数据
export const findHot = () => {
  return request({
    url: '/home/hot',
    method: 'GET'
  })
}
// 产品区块
export const findGoods = () => {
  return request({
    url: '/home/goods',
    method: 'GET'
  })
}
// 最新专题
export const findSpecial = () => {
  return request({
    url: '/home/special',
    method: 'GET'
  })
}
