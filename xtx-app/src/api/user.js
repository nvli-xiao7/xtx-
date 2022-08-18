// 登录
// 定义首页需要的接口函数
import request from '@/utils/request'
/**
 *
 * @param {*} account用户名
 * @param {*} password密码
 * @returns
 */
export const userAccountLogin = ({ account, password }) => {
  return request({
    url: '/login',
    method: 'POST',
    data: { account, password }
  })
}
/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = ({ mobile }) => {
  return request({
    url: '/login/code',
    method: 'GET',
    params: { mobile }
  })
}
/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request({
    url: '/login/code',
    method: 'POST',
    data: { mobile, code }
  })
}
