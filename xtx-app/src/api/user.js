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
/**
 * @param {String}unionId --第三方QQ登录唯一标识
 */
export const userQQLogin = ({ unionId, source = 1 }) => {
  return request({
    url: '/login/social',
    method: 'POST',
    data: { unionId, source }
  })
}
/**
 *qq绑定
 * @param {*} unionId 唯一标识
 * @param {String} mobile 手机号
 * @param {String} code 验证码
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request({
    url: '/login/social/bind',
    method: 'POST',
    data: { unionId, mobile, code }
  })
}
/**
 *qq绑定验证码
 * @param {String} mobile 手机号
 */
export const userQQBindCode = ({ mobile }) => {
  return request({
    url: '/login/social/code',
    method: 'GET',
    params: { mobile }
  })
}
/**
 *完善信息
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userComplement = ({ unionId, account, mobile, code, password }) => {
  return request({
    url: `/login/social/${unionId}/complement`,
    method: 'POST',
    data: { account, mobile, code, password }
  })
}
/**
 * 判断唯一名字
 * @param {*} account
 * @returns
 */
export const userCheckAccount = (account) => {
  return request({
    url: '/register/check',
    method: 'GET',
    params: { account }
  })
}
