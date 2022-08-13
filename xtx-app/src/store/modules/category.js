// 分类模块
import { topCategory } from '@/api/constants.js'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    // 获取数据替换
    setList (state, headCategory) {
      state.list = headCategory
    },
    // 修改当前一级分类下的open数据为true
    show (state, item) {
      const category = state.list.find(category => category.id === item.id)
      category.open = true
    },
    // 修改当前一级分类下的open数据为false
    hide (state, item) {
      const category = state.list.find(category => category.id === item.id)
      category.open = false
    }
  },
  actions: {
    // 一级分类获取数据
    async  getList ({ commit }) {
      const res = await findAllCategory()
      // 添加open
      res.result.forEach(item => {
        item.open = false
      })
      commit('setList', res.result)
    }
  }

}
