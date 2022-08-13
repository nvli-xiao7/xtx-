// 定义首页需要的接口函数
import request from '@/utils/request'
/**
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request({
    url: '/home/category/head',
    method: 'GET'
  })
}
/**
 * 获取一级商品分类
 */
export const findCategory = (id) => {
  return request({
    url: '/category',
    method: 'GET',
    params: { id }
  })
}
/**
 * 二级类目-筛选条件-PC
 */
export const findFilter = (id) => {
  return request({
    url: '/category/sub/filter',
    method: 'GET',
    params: { id }
  })
}
/**
 * 二级类目-商品列表-PC
 */
export const findTemporary = (data) => {
  return request({
    url: '/category/goods/temporary',
    method: 'POST',
    data
  })
}
