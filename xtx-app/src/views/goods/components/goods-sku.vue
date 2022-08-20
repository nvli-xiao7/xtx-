<template>
<!-- 商品规格 -->
  <div class="goods-sku">
    <div v-for="item in goods.specs" :key="item.id">
      <dl>
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="sub in item.values" :key="sub.id">
        <img  :class="{selected:sub.selected}"
        :src="sub.picture"
        alt=""
        v-if="sub.picture"
        :title="sub.name"
        @click="clickSpecs(item,sub)"
        >
        <span  :class="{selected:sub.selected,disabled:sub.disabled}" v-else @click="clickSpecs(item,sub)">{{sub.name}}</span>
        </template>
      </dd>
    </dl>
    </div>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 点击选择的物品属性
    const clickSpecs = (item, sub) => {
      if (sub.disabled) return false
      // 如果有true,则取消
      if (sub.selected) {
        sub.selected = false
      } else {
        // 反之添加false,将高亮点上
        item.values.forEach(p => {
          if (p.selected === true) {
            p.selected = false
          }
        })
        sub.selected = true
      }
      // 点击的时候更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的sku信息通知父组件{skuId,price,oldPrice,inventory,specsText}
      // 1. 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 2. 不是完整的sku组合按钮，提交空对象父组件
      // 将点击的是规格组合数组
      const validSelectedValues = getSelectedArr(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        // 不完整
        // 父组件需要判断是否规格选择完整，不完整不能加购物车。
        emit('change', {})
      }
    }
    // 根据skus数据得到路径字典对象
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化的时候更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 默认选中
    initSelectedStatus(props.goods, props.skuId)
    return { clickSpecs }
  }
}
const spliter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    // 查看库存
    if (sku.inventory) {
      // 组成新的数组
      const specs = sku.specs.map(spec => spec.valueName)
      const powerSet = getPowerSet(specs)
      // 将获取的计算方法遍历
      powerSet.forEach(set => {
        // 将其拼接为字符串
        const key = set.join(spliter)
        if (pathMap[key]) {
          // 灰蓝几何★90cm: ["300470326"]
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 如果没有则设置数组
          // 59cm: (3) ["300470322", "300470327", "300470332"]
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach(spec => {
    const selectedVal = spec.values.find(val => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}
// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach(val => {
      // 已经选中的按钮不用判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name
      // 过滤无效值得到key
      const key = selectedArr.filter(v => v).join(spliter)
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}
// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  // 如果skuId=sku.id的话，将其对应区出来
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    // 如果有值
    goods.specs.forEach((spec, i) => {
      // const value = sku.specs[i].valueName
      // spec.values.forEach(val => {
      //   val.selected = val.name === value
      // })
      // 将skus的第一个找出来，将其点亮
      const val = spec.values.find(val => val.name === sku.specs[i].valueName)
      val.selected = true
    })
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
