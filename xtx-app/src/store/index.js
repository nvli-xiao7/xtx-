import { createStore } from 'vuex'
// 导入持久化包
import createPersistedstate from 'vuex-persistedstate'
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({
  state: {
    // 数据
  },
  getters: {
    // vuex的计算属性
    username: state => state.user.profile// 快捷访问用户信息
  },
  mutations: {
  // 改数据函数
  },
  actions: {
    // 请求数据函数
  },
  modules: {
    // 分模块
    user,
    cart,
    category
  },
  //    默认是存储在localStorage中
  //  key是存储数据的键名
  //  paths是存储state中的那些数据，如果是模块下具体的数据需要加上模块名称，如user.token
  //  修改state后触发才可以看到本地存储数据的的变化。
  plugins: [
    createPersistedstate({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
