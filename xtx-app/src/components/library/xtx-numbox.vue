<template>
<!-- 商品详情-大量选择组件 -->
  <div class="xtx-numbox">
    <div class="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1) ">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(+1) ">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    max: {
      type: Number,
      default: 100
    },
    label: {
      type: String,
      default: ''
    },
    // min: {
    //   type: Number,
    //   default: 1
    // },
    modelValue: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 双向绑定的数据
    const num = useVModel(props, 'modelValue', emit)
    const changeNum = (sum) => {
      // 将按钮的值加起来
      const newValue = num.value + sum
      // 判断是否大于
      if (newValue < 1) return
      if (newValue > props.max) return
      // 将值赋值给父组件
      num.value = newValue
      emit('change', newValue)
    }
    return { changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
