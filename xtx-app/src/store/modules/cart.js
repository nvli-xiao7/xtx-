// 购物车状态
import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, checkAllCart, checkCount } from '@/api/cart.js'
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  mutations: {
    // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
    insertCart (state, goods) {
      const sameIndex = state.list.findIndex(item => item.skuId === goods.skuId)
      // 逻辑：有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        goods.count = state.list[sameIndex].count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    // ... 省略
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息：nowPrice stock isEffective
      // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
      // goods 商品对象 必需有SKUID
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 设置购物车列表
    setCartList (state, list) {
      state.list = list
    }
  },
  actions: {
    // 合并购物车
    // 合并购物车
    async mergeCart (ctx) {
      // 准备合并的参数
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeLocalCart(cartList)
      // 合并成功，清空本地购物车
      ctx.commit('setCart', [])
    },
    // 修改规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
        // 已登录
          // 登录 TODO
          // 1. 获取原先商品的数量
          // 2. 删除原先商品
          // 3. 获取修改的skuId 和 原先商品数量 做一个加入购物车操作
          // 4. 更新列表
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
        // 未登录
          // 1. 获取旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧的商品
          ctx.commit('deleteCart', oldSkuId)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 去插入即可
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 修改购物车（选中状态，数量）
    updateCart (ctx, payload) {
      // payload 需要：必需有skuId  可能：selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          ctx.commit('updateCart', payload)
          checkCount(payload).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        // 已登录
        } else {
        // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 加入购物车
    insertCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已经登录
          insertCart(goods).then(data => {
            ctx.commit('insertCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },

    // 获取购物车列表
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = ctx.state.list.map(item => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          }).catch(e => {
            reject(e)
          })
        }
      })
    },
    // ... 省略
    // 删除购物车商品
    // 删除购物车
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO[skuId]
          deleteCart([skuId]).then(() => {
            ctx.commit('deleteCart', skuId)
            resolve()
          })
        } else {
          // 本地
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 做有效商品的全选&反选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart(selected, ids).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
            resolve()
          })
        }
      })
    },
    // 全删除按钮
    batchDeleteCart (ctx, type) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          ctx.getters[type ? 'invalidList' : 'selectedList'].forEach(item => {
            deleteCart([item.skuId]).then(() => {
              ctx.commit('deleteCart', item.skuId)
              resolve()
            })
          })
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          ctx.getters[type ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
            resolve()
          })
        }
      })
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数,引用上面的
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // ... getters 代码
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + (c.nowPrice * 100 * c.count), 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }

  }
}
