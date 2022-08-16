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
        <span  :class="{selected:sub.selected}" v-else @click="clickSpecs(item,sub)">{{sub.name}}</span>
        </template>
      </dd>
    </dl>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },
  setup () {
    // 点击选择的物品属性
    const clickSpecs = (item, sub) => {
      // 如果有true,则取消
      if (sub.selected) {
        sub.selected = false
      } else {
        // 反之添加false,将高亮点上
        item.values.forEach(p => p.selected === false)
        sub.selected = true
      }
    }
    return { clickSpecs }
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
